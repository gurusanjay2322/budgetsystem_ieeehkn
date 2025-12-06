package com.example.backend.dto;

import com.example.backend.model.TransactionStatus;
import lombok.Data;

@Data
public class UpdateTransactionRequest {
    private TransactionStatus status;
    private String notes;
}
