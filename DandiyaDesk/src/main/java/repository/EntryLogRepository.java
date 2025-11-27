package repository;

import model.EntryLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntryLogRepository extends JpaRepository<EntryLog,Long> {
    List<EntryLog> findBySerialNumber(String serialNumber);
    List<EntryLog> findByMobileNumber(String mobileNumber);
}
