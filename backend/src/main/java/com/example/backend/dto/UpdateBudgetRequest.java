package com.example.backend.dto;

import lombok.Data;

@Data
public class UpdateBudgetRequest {

    private String name;
    private Double initialAmount;
    private String academicYear;
}
