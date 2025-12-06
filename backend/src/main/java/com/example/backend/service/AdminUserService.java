package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserStatus;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(RegisterRequest req) {

        if (req.getRole().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Only one admin is allowed!");
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.valueOf(req.getRole().toUpperCase()))
                .createdAt(System.currentTimeMillis())
                .status(UserStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    public List<User> createUsers(List<RegisterRequest> list) {
        List<User> created = new ArrayList<>();

        for (RegisterRequest req : list) {
            created.add(createUser(req));
        }

        return created;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void updateUserRole(Long id, String role) {
        if (role.equalsIgnoreCase("ADMIN"))
            throw new RuntimeException("Only one admin allowed.");

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
    }

    public void disableUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.DISABLED);
        userRepository.save(user);
    }
}
