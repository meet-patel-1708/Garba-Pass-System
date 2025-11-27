package repository;

import model.GeneratedPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface GeneratedPassRepo extends JpaRepository<GeneratedPass, Long> {

    Optional<GeneratedPass> findBySerialNumber(String serial);

    List<GeneratedPass> findByOrganizerAdharCardAndStatus(
            Long organizerAdharCard,
            GeneratedPass.GeneratedPassStatus status
    );

    long countByOrganizerAdharCardAndStatus(
            Long organizerAdharCard,
            GeneratedPass.GeneratedPassStatus status
    );

    // FIXED: Use entity name (GeneratedPass) and Java field name (organizerAdharCard)
    @Query("SELECT COUNT(p) FROM GeneratedPass p WHERE p.organizerAdharCard = :value")
    long total_pass(@Param("value") long value);

    @Query("SELECT COUNT(p) FROM GeneratedPass p WHERE p.organizerAdharCard = :value AND p.status=SOLD")
    long total_sold_pass(@Param("value") long value);

    @Query("SELECT p FROM GeneratedPass p WHERE p.serialNumber = :serial")
    Optional<GeneratedPass> getPassBySerialNumber(@Param("serial") String serial);
}