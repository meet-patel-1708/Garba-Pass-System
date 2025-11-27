package repository;

import model.AdminRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<AdminRegistration,Long> {
    Optional<AdminRegistration> findByPhone(String phone);
    Optional<AdminRegistration> findByIdentityCardNumber(String identityCardNumber);
}
