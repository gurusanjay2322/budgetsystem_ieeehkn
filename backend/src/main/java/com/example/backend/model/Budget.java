package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "academic_year")
    private String academicYear;

    @Column(name = "initial_amount")
    private Double initialAmount;
    @Column(nullable = false)
    private Double remainingAmount = 0.0;



    @Column(name = "created_by")
    private Long createdBy;   // FK to users table

    @Column(name = "created_at")
    private Long createdAt; // unix timestamp
}
