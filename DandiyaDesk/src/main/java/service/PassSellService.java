package service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.GeneratedPass;
import model.Pass;
import model.PassOrder;
import model.UserRegistration;
import org.springframework.stereotype.Service;
import repository.GeneratedPassRepo;
import repository.PassOrderRepo;
import repository.PassRepo;
import repository.UserRepo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PassSellService {

    private final GeneratedPassRepo generatedPassRepo;
    private final PassOrderRepo orderRepo;
    private final PassRepo passRepo;
    private final UserRepo userRepo;

    public Pass completePassSell(Long orderId, String paymentRef) {

        PassOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == PassOrder.Status.SUCCESS)
            throw new RuntimeException("Order already completed");

        order.setStatus(PassOrder.Status.SUCCESS);
        order.setPaymentRef(paymentRef);
        orderRepo.save(order);

        // Get one available generated pass
        Optional<GeneratedPass> optional = generatedPassRepo
                .findByOrganizerAdharCardAndStatus(
                        order.getOrganizerId(),
                        GeneratedPass.GeneratedPassStatus.AVAILABLE
                )
                .stream()
                .findFirst();

        if (optional.isEmpty())
            throw new RuntimeException("No available passes left for sale");

        GeneratedPass gp = optional.get();

        // ❌ WRONG: gp.getStatus(status)
        // ✔ CORRECT:
        gp.setStatus(GeneratedPass.GeneratedPassStatus.SOLD);
        generatedPassRepo.save(gp);

        UserRegistration buyer = userRepo.findById(order.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Pass issued = Pass.builder()
                .serialNumber(gp.getSerialNumber())
                .owner(buyer)
                .issuedAt(LocalDateTime.now())
                .expiryDate(LocalDate.from(LocalDateTime.now().plusDays(9)))
                .active(true)
                .usedDays(0)
                .build();

        passRepo.save(issued);

        log.info("Pass {} sold to user {}", gp.getSerialNumber(), buyer.getId());

        return issued;
    }

    public PassOrder createNewOrder(Long buyerId, Long organizerId, double amount) {

        PassOrder order = PassOrder.builder()
                .buyerId(buyerId)
                .organizerId(organizerId)
                .amount(java.math.BigDecimal.valueOf(amount))
                .status(PassOrder.Status.PENDING)
                .build();

        return orderRepo.save(order);
    }
}
