package repository;

import model.Pass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PassRepo extends JpaRepository<Pass,Long> {
    Optional<Pass> findBySerialNumber(String serial);
    boolean existsByOwnerId(Long ownerId);

    List<Pass> findByActiveTrue();
    List<Pass> findByActiveFalse();

    @Query("SELECT COUNT(p) FROM Pass p WHERE p.remainingDays<=0")
    List<Pass> findExpiredPasses();

    @Query("SELECT COUNT(p) FROM Pass p WHERE p.active=true")
    long countActivePasses();
    @Query("SELECT COUNT(p) FROM Pass p WHERE p.active=false")
    long countBlockedPasses();

    @Query("SELECT COUNT(p) FROM Pass p WHERE p.remainingDays<=0")
    long countExpiredPasses();
}
