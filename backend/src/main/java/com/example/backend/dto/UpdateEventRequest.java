package com.example.backend.dto;

import lombok.Data;

@Data
public class UpdateEventRequest {
    private String name;
    private Double allocatedAmount;
}
