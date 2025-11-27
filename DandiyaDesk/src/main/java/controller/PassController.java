package controller;

import ch.qos.logback.core.model.processor.PhaseIndicator;
import lombok.RequiredArgsConstructor;
import model.Pass;
import model.UserRegistration;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import repository.PassRepo;
import repository.UserRepo;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pass")
@RequiredArgsConstructor
public class PassController {
    private final UserRepo userRepo;
    private final PassRepo passRepo;

    @PostMapping("/issue/{userId}")
    public Pass issuePass(@PathVariable Long userId){
        if(passRepo.existsByOwnerId(userId)){
            throw new RuntimeException("User Already has pass");
        }
        UserRegistration user = userRepo.findById(userId).orElseThrow(()->new RuntimeException("User not found"));

        Pass pass = Pass.builder()
                .owner(user)
                .serialNumber("GARBA-" + System.currentTimeMillis())
                .issuedAt(LocalDateTime.now())
                .active(true)
                .build();

        return passRepo.save(pass);
    }
}
