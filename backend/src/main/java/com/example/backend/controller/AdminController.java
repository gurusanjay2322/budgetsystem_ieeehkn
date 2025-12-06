package com.example.backend.controller;

import com.example.backend.dto.CreateManyUsersRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService adminUserService;

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(adminUserService.createUser(req));
    }

    @PostMapping("/create-users")
    public ResponseEntity<?> createUsers(@RequestBody CreateManyUsersRequest req) {
        return ResponseEntity.ok(adminUserService.createUsers(req.getUsers()));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/role/{userId}")
    public ResponseEntity<?> changeRole(
            @PathVariable Long userId,
            @RequestParam String role) {

        adminUserService.updateUserRole(userId, role);
        return ResponseEntity.ok("User role updated");
    }

    @PutMapping("/disable/{userId}")
    public ResponseEntity<?> disableUser(@PathVariable Long userId) {
        adminUserService.disableUser(userId);
        return ResponseEntity.ok("User disabled");
    }
}
