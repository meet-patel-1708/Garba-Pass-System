package model;

import lombok.Data;

@Data
public class LoginRequest {
    private String phone;
    private String identityCardNumber;
}
