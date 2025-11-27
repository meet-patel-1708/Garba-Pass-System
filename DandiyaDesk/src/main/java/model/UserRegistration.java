package model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import model.Role;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name required")
    private String fullName;

    @NotBlank
    @Size(min = 10,max = 10)
    private String phone;

    @NotBlank
    @Pattern(regexp = "\\d{12}",message = "Adhar must be 12 digits")
    @Column(unique = true)
    private String identityCardNumber;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String password;

    @Column(name="pass_id")
    private String passId;

    @Column(name="price")
    private String price;
}
