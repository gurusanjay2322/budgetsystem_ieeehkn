package com.example.backend.controller;

import com.example.backend.dto.CreateDeadlineRequest;
import com.example.backend.model.Deadline;
import com.example.backend.model.User;
import com.example.backend.service.DeadlineService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deadlines")
@RequiredArgsConstructor
public class DeadlineController {

    private final DeadlineService deadlineService;
    private final UserService userService;

    private String getLoggedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Deadline> createDeadline(@RequestBody CreateDeadlineRequest req) {
        User user = userService.getUserByUsername(getLoggedUsername());
        return ResponseEntity.ok(deadlineService.createDeadline(req, user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Deadline>> getAll() {
        return ResponseEntity.ok(deadlineService.getAllDeadlines());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDeadline(@PathVariable Long id) {
        deadlineService.deleteDeadline(id);
        return ResponseEntity.ok("Deadline deleted successfully");
    }
}
