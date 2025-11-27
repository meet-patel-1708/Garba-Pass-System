package service;

import model.AdminRegistration;
import model.UserRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.AdminRepo;

@Service
public class AdminLoginService {
    @Autowired
    private AdminRepo adminRepo;

    public AdminRegistration loadAdminByPhoneNumber(String phone){
        return  adminRepo.findByPhone(phone)
                .orElseThrow(()->new RuntimeException("User not found"));
    }
}
