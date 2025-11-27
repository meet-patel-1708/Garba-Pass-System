package controller;

import lombok.RequiredArgsConstructor;
import model.*;
import org.springframework.web.bind.annotation.*;
import repository.AdminRepo;
import repository.UserRepo;
import security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AdminRepo adminRepo;
    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {

        var userOpt = userRepo.findByPhone(req.getPhone()).filter(u->u.getIdentityCardNumber().equals(req.getIdentityCardNumber()));
        if(userOpt.isPresent()){
            UserRegistration user = userOpt.get();
            String token = jwtUtil.generateToken(user.getId(),user.getRole().name());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .role(user.getRole().name())
                .userID(user.getId())
                .build();
        }
        var adminOpt = adminRepo.findByPhone(req.getPhone()).filter(u->u.getIdentityCardNumber().equals(req.getIdentityCardNumber()));
        if(adminOpt.isPresent()){
            AdminRegistration admin = adminOpt.get();
            String token = jwtUtil.generateToken(admin.getId(),admin.getRole().name());

            return AuthResponse.builder()
                    .success(true)
                    .token(token)
                    .role(admin.getRole().name())
                    .userID(admin.getId())
                    .build();
        }
        throw new RuntimeException("Invalid phone or aadhar number");
    }
}
