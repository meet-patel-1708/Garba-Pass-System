package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pass")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Pass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String serialNumber;

    @OneToOne
    @JoinColumn(name = "owner_id")
    private UserRegistration owner;

    private LocalDateTime issuedAt;

    private boolean active = true;

    // ✅ New Fields
    private LocalDate expiryDate; // issuedAt + 9 days

    private int usedDays = 0; // How many days already scanned?

    private int remainingDays = 9;
    public boolean isExpired(){
        return remainingDays<=0;
    }
}
