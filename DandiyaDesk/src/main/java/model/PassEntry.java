package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pass_entries",uniqueConstraints = @UniqueConstraint(columnNames = {"pass_id","entry_date"}))
@NoArgsConstructor @AllArgsConstructor
@Data
@Builder
public class PassEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pass_id")
    private Pass pass;

    private LocalDate entryDate;
}
