package controller;

import lombok.RequiredArgsConstructor;
import model.AdminRegistration;
import model.AuthResponse;
import model.LoginRequest;
import model.UserRegistration;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.AdminRepo;
import repository.UserRepo;
import security.JwtUtil;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminLoginController {
    private final AdminRepo adminRepo;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public AdminRegistration registration(@RequestBody AdminRegistration admin){
        return adminRepo.save(admin);
    }
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {

        // Validate input phone + Aadhaar Number
        AdminRegistration admin = adminRepo.findByPhone(req.getPhone())
                .filter(u -> u.getIdentityCardNumber().equals(req.getIdentityCardNumber()))
                .orElseThrow(() -> new RuntimeException("Invalid Phone or Aadhaar Number"));

        // Generate JWT Token
        String token = jwtUtil.generateToken(admin.getId(), admin.getRole().name());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .role(admin.getRole().name())
                .userID(admin.getId())
                .build();
    }
}
