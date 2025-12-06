package com.example.backend.dto;

import lombok.Data;

@Data
public class CreateEventRequest {
    private String name;
    private Double allocatedAmount;
}

