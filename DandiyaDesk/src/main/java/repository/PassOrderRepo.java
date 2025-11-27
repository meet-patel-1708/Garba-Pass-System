package repository;

import model.PassOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassOrderRepo extends JpaRepository<PassOrder,Long> {
}
