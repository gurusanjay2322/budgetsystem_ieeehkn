package com.example.backend.service;

import com.example.backend.dto.CreateTransactionRequest;
import com.example.backend.dto.UpdateTransactionRequest;
import com.example.backend.model.*;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepo;
    private final BudgetRepository budgetRepo;
    private final EventRepository eventRepo;

    public Transaction createTransaction(CreateTransactionRequest req, Long createdBy) {

        // Validate budget
        budgetRepo.findById(req.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        // If event exists, validate
        if (req.getEventId() != null) {
            eventRepo.findById(req.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
        }

        Transaction tr = Transaction.builder()
                .budgetId(req.getBudgetId())
                .eventId(req.getEventId())
                .type(req.getType())
                .category(req.getCategory())
                .amount(req.getAmount())
                .status(req.getStatus() != null ? req.getStatus() : TransactionStatus.CONFIRMED)
                .notes(req.getNotes())
                .createdBy(createdBy)
                .timestamp(System.currentTimeMillis())
                .build();

        return transactionRepo.save(tr);
    }
    public Transaction getById(Long id) {
        return transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }


    public List<Transaction> getAll() {
        return transactionRepo.findAll();
    }

    public List<Transaction> getByBudget(Long budgetId) {
        return transactionRepo.findByBudgetId(budgetId);
    }

    public Transaction update(Long id, UpdateTransactionRequest req) {
        Transaction tr = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (req.getStatus() != null) tr.setStatus(req.getStatus());
        if (req.getNotes() != null) tr.setNotes(req.getNotes());

        return transactionRepo.save(tr);
    }

    public void delete(Long id) {
        transactionRepo.deleteById(id);
    }
}
