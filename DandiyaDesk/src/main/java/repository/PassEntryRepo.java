package repository;

import model.Pass;
import model.PassEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface PassEntryRepo extends JpaRepository<PassEntry,Long> {
    Optional<PassEntry> findByPassAndEntryDate(Pass pass, LocalDate date);
}
