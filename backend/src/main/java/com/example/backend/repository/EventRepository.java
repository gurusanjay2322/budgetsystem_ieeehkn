package com.example.backend.repository;

import com.example.backend.model.Event;
import com.example.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByBudget(Budget budget);
}
