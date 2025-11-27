package repository;

import model.UserRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserRegistration, Long> {
    Optional<UserRegistration> findByPhone(String phone);
    Optional<UserRegistration> findByIdentityCardNumber(String aadhar);

    @Modifying
    @Query("UPDATE UserRegistration u SET u.passId = :passId, u.price = :price WHERE u.identityCardNumber = :aadhar")
    int updatePassIdAndPrice(@Param("aadhar") String aadhar, @Param("passId") String passId, @Param("price") String price);

    @Query("SELECT u FROM UserRegistration u WHERE u.identityCardNumber = :identityCardNumber")
    Optional<UserRegistration> fetchPass(@Param("identityCardNumber") String identity_card_number);
}