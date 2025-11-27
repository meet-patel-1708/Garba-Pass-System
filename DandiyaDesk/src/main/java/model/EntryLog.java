package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "entry_log")
@Data
@NoArgsConstructor @AllArgsConstructor @Builder
public class EntryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String serialNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserRegistration user;

    private LocalDateTime entryTime;

    private int remainingDays;
    private String status;
    private String mobileNumber;
    private boolean successfulEntry;

}
