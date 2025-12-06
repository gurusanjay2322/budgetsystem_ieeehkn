package com.example.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String phone;
    private String username;
    private String password;
    private String role; // ADMIN, TREASURER, MEMBER
}
