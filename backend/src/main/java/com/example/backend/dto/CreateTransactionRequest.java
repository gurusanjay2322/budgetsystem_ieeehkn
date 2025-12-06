package com.example.backend.dto;

import com.example.backend.model.TransactionType;
import com.example.backend.model.TransactionStatus;
import lombok.Data;

@Data
public class CreateTransactionRequest {

    private Long budgetId;
    private Long eventId;
    private TransactionType type;
    private String category;
    private Double amount;
    private TransactionStatus status;
    private String notes;
}
