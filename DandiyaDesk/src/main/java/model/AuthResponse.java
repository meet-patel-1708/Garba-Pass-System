package model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private boolean success;
    private String token;
    private String role;
    private Long userID;
}
