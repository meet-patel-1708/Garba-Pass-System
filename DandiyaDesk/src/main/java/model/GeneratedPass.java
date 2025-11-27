package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "generated_pass",indexes = {@Index(columnList = "serial_number",name = "indx_genpass_serial",unique = true)})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GeneratedPass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "serial_number",nullable = false,unique = true,length = 80)
    private String serialNumber;

    @Column(name = "organizer_adhar_card_number",nullable = false)
    private Long organizerAdharCard;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GeneratedPassStatus status = GeneratedPassStatus.AVAILABLE;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum GeneratedPassStatus{
        AVAILABLE,
        RESERVED,
        SOLD,
        BLOCKED
    }

    @PrePersist
    private void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }
    @PreUpdate
    private void onUpdate(){
        updatedAt = LocalDateTime.now();
    }

    @Column(name = "remaining_days", nullable = false, columnDefinition = "integer default 9")
    private int remainingDays = 9;

    @Column(name = "used_days", nullable = false, columnDefinition = "integer default 0")
    private int usedDays = 0;
}
