package service;

import jakarta.transaction.Transactional;
import model.GeneratedPass;
import model.Pass;
import model.UserRegistration;
import org.springframework.stereotype.Service;
import repository.GeneratedPassRepo;
import repository.PassRepo;
import repository.UserRepo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class GeneratedPassService {

    private final GeneratedPassRepo genRepo;
    private final PassRepo passRepo;
    private final UserRepo userRepo;

    public GeneratedPassService(GeneratedPassRepo genRepo, PassRepo passRepo, UserRepo userRepo) {
        this.genRepo = genRepo;
        this.passRepo = passRepo;
        this.userRepo = userRepo;
    }

    public List<GeneratedPass> generateBulk(Long organizerAdharCard, int count, BigDecimal price, String serialPrefix) {

        if (count <= 0) throw new IllegalArgumentException("Count must be > 0");

        List<GeneratedPass> created = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {

            String serial;
            do {
                serial = serialPrefix + "-" + System.currentTimeMillis() + "-" + randomAlphaNum(6);
            } while (genRepo.findBySerialNumber(serial).isPresent());

            GeneratedPass gp = new GeneratedPass();
            gp.setSerialNumber(serial);
            gp.setOrganizerAdharCard(organizerAdharCard);
            gp.setPrice(price);
            gp.setStatus(GeneratedPass.GeneratedPassStatus.AVAILABLE);

            created.add(genRepo.save(gp));
        }

        System.out.println("Generated " + created.size() + " passes for organizer " + organizerAdharCard);

        return created;
    }

    public List<GeneratedPass> listAvailable(Long organizerAdharCardNumber) {
        System.out.println("Fetching available pass for specific organizer");
        List<GeneratedPass> passes = genRepo.findByOrganizerAdharCardAndStatus(
                organizerAdharCardNumber,
                GeneratedPass.GeneratedPassStatus.AVAILABLE
        );
        return passes;
    }
    @Transactional
    public Pass sellGeneratedPassToUser(String serialNumber, Long buyerAdharCard) {

        GeneratedPass gp = genRepo.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Generated pass not found"));

        if (gp.getStatus() != GeneratedPass.GeneratedPassStatus.AVAILABLE) {
            throw new RuntimeException("Pass is not available for sale");
        }

        // Find user by Aadhar card number (identity card number)
        UserRegistration buyer = userRepo.findByIdentityCardNumber(String.valueOf(buyerAdharCard))
                .orElseThrow(() -> new RuntimeException("Buyer not found with Aadhar: " + buyerAdharCard));

        // ✅ Update user's passId and price
        buyer.setPassId(gp.getSerialNumber());
        buyer.setPrice(gp.getPrice().toString());
        userRepo.save(buyer);

        System.out.println("✅ Updated user " + buyerAdharCard + " with passId: " + gp.getSerialNumber());

        // ✅ Change pass status to SOLD
        gp.setStatus(GeneratedPass.GeneratedPassStatus.SOLD);
        genRepo.save(gp);

        System.out.println("✅ Changed pass status to SOLD");

        // Create Pass record
        Pass issued = new Pass();
        issued.setSerialNumber(gp.getSerialNumber());
        issued.setOwner(buyer);
        issued.setIssuedAt(LocalDateTime.now());
        issued.setExpiryDate(LocalDateTime.now().toLocalDate().plusDays(9));
        issued.setActive(true);
        issued.setUsedDays(0);

        passRepo.save(issued);

        System.out.println("✅ Sold pass " + serialNumber + " to user " + buyerAdharCard);

        return issued;
    }

    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private String randomAlphaNum(int len) {
        Random r = new Random();
        return IntStream.range(0, len)
                .mapToObj(i -> String.valueOf(ALPHANUM.charAt(r.nextInt(ALPHANUM.length()))))
                .collect(Collectors.joining());
    }

    public long getTotalPass(long organizerAdharCardNumber) {
        return genRepo.total_pass(organizerAdharCardNumber);
    }
    public long getTotalSoldPass(long organizerAdharCardNumber){
        return genRepo.total_sold_pass(organizerAdharCardNumber);
    }
    public Optional<GeneratedPass> getPassBySerial(String serialNumber){
        return genRepo.getPassBySerialNumber(serialNumber);
    }
}
