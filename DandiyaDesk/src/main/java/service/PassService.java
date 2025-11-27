package service;

import lombok.RequiredArgsConstructor;
import model.Pass;
import model.UserRegistration;
import org.springframework.stereotype.Service;
import repository.PassRepo;
import repository.UserRepo;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PassService {
    private final PassRepo passRepo;
    private final UserRepo userRepo;
    public Pass issuePass(Long userId){
        if(passRepo.existsByOwnerId(userId)){
            throw new RuntimeException("User already has a pass");
        }
        UserRegistration user = userRepo.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        LocalDateTime issuedAt = LocalDateTime.now();
        Pass pass = Pass.builder()
                .serialNumber("GARBA-"+System.currentTimeMillis())
                .owner(user)
                .issuedAt(issuedAt)
                .expiryDate(LocalDate.now().plusDays(9))
                .active(true)
                .usedDays(0)
                .build();
        return  passRepo.save(pass);
    }
}
