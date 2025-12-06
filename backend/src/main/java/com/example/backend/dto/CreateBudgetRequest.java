package com.example.backend.dto;

import lombok.Data;

@Data
public class CreateBudgetRequest {

    private String name;
    private String academicYear;
    private Double initialAmount;
}
