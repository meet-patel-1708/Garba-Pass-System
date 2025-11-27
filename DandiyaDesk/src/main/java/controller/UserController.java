package controller;

import lombok.RequiredArgsConstructor;
import model.UserRegistration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.UserRepo;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepo userRepo;

    @PostMapping("/register")
    public UserRegistration register(@RequestBody UserRegistration user) {
        return userRepo.save(user);
    }

    @PutMapping("/add_pass")
    public UserRegistration addPass(@RequestBody UserRegistration user) {
        return userRepo.save(user);
    }

    @GetMapping("/fetchPass/{identityCardNumber}")
    public ResponseEntity<UserRegistration> fetchPass(@PathVariable String identityCardNumber) {
        System.out.println("Searching for identity card: '" + identityCardNumber + "'");
        System.out.println("identity card length: " + identityCardNumber.length());

        Optional<UserRegistration> user = userRepo.findByIdentityCardNumber(identityCardNumber);
        System.out.println("Found: " + user.isPresent());

        if (user.isPresent()) {
            System.out.println("User details: " + user.get());
        }

        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fetch_pass_by_admin/{identityCardNumber}")
    public ResponseEntity<UserRegistration> fetchPassDetails(@PathVariable String identityCardNumber) {
        System.out.println("Admin fetching identity card: '" + identityCardNumber + "'");
        System.out.println("Identity card length: " + identityCardNumber.length());

        Optional<UserRegistration> user = userRepo.findByIdentityCardNumber(identityCardNumber);
        System.out.println("Found: " + user.isPresent());

        if (user.isPresent()) {
            UserRegistration userData = user.get();
            System.out.println("Found user: " + userData.getFullName());
            System.out.println("Mobile: " + userData.getPhone());
            System.out.println("Pass ID: " + userData.getPassId());
        }

        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}