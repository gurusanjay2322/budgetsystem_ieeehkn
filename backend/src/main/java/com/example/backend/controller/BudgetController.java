package com.example.backend.controller;

import com.example.backend.dto.CreateBudgetRequest;
import com.example.backend.dto.UpdateBudgetRequest;
import com.example.backend.model.Budget;
import com.example.backend.model.User;
import com.example.backend.service.BudgetService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;

    // Extract logged-in username from JWT
    private String getLoggedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Budget> createBudget(@RequestBody CreateBudgetRequest req) {
        User admin = userService.getUserByUsername(getLoggedUsername());
        return ResponseEntity.ok(budgetService.createBudget(req, admin.getId()));
    }

    // ADMIN + TREASURER + MEMBER
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Budget>> getAll() {
        return ResponseEntity.ok(budgetService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<Budget> getById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody UpdateBudgetRequest req
    ) {
        User loggedUser = userService.getUserByUsername(getLoggedUsername());
        return ResponseEntity.ok(budgetService.updateBudget(id, req, loggedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok("Budget deleted successfully");
    }

    @GetMapping("/current")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<Budget> getCurrentBudget() {
        return ResponseEntity.ok(budgetService.getCurrentAcademicYearBudget());
    }
}
