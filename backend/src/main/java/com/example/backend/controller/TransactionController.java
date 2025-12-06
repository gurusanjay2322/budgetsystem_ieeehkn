package com.example.backend.controller;

import com.example.backend.dto.CreateTransactionRequest;
import com.example.backend.dto.UpdateTransactionRequest;
import com.example.backend.model.Transaction;
import com.example.backend.model.User;
import com.example.backend.service.TransactionService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    private String getLoggedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // ADMIN + TREASURER
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Transaction> create(@RequestBody CreateTransactionRequest req) {
        User creator = userService.getUserByUsername(getLoggedUsername());
        return ResponseEntity.ok(transactionService.createTransaction(req, creator.getId()));
    }

    // ALL ROLES: view
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(transactionService.getAll());
    }

    @GetMapping("/budget/{budgetId}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Transaction>> getByBudget(@PathVariable Long budgetId) {
        return ResponseEntity.ok(transactionService.getByBudget(budgetId));
    }

    // ADMIN + TREASURER
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Transaction> update(
            @PathVariable Long id,
            @RequestBody UpdateTransactionRequest req
    ) {
        return ResponseEntity.ok(transactionService.update(id, req));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        Transaction tx = transactionService.getById(id);
        return ResponseEntity.ok(tx);
    }


    // ADMIN ONLY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.ok("Transaction deleted");
    }
}
