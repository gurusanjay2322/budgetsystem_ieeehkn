package com.example.backend.config;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserStatus;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialAdminLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Check if admin already exists
        if (!userRepository.existsByRole(Role.ADMIN)) {

            User admin = User.builder()
                    .fullName("Admin")
                    .email("admin@example.com")
                    .username("admin")
                    .phone("0000000000")
                    .password(passwordEncoder.encode("admin@123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .createdAt(System.currentTimeMillis())
                    .build();

            userRepository.save(admin);
            System.out.println("✔ Default admin created: admin / admin@123");
        }
    }
}
