package model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "pass_order")
@Data
@NoArgsConstructor @AllArgsConstructor @Builder
public class PassOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long buyerId;
    private Long organizerId;
    private BigDecimal amount;
    private String paymentRef;

    @Enumerated(EnumType.STRING)
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public enum Status{
        PENDING,
        SUCCESS,
        FAILED
    }
    @PrePersist
    private void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    };
    @PreUpdate
    private void onUpdate(){
        updatedAt = LocalDateTime.now();
    };
}
