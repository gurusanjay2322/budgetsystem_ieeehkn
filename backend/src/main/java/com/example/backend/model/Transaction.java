package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transactions")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long budgetId;

    private Long eventId;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // INCOME / EXPENSE

    private String category;

    private Double amount;

    private Long timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status; // CONFIRMED, PLANNED, RECURRING

    @Column(columnDefinition = "text")
    private String notes;

    private Long createdBy;
}
