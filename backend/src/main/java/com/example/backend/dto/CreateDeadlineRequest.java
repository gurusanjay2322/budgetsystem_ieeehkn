package com.example.backend.dto;

import lombok.Data;

@Data
public class CreateDeadlineRequest {
    private String title;
    private String description;
    private Long dueTimestamp;
}
