package com.example.backend.service;

import com.example.backend.dto.CreateEventRequest;
import com.example.backend.dto.UpdateEventRequest;
import com.example.backend.model.Budget;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepo;
    private final BudgetRepository budgetRepo;
    private final BudgetService budgetService;

    // CREATE EVENT — deduct allocated amount
    public Event createEvent(CreateEventRequest req, User creator) {

        // Get current academic year string
        String academicYear = budgetService.getCurrentAcademicYearString();

        Budget budget = budgetRepo.findByAcademicYear(academicYear);
        if (budget == null) {
            throw new RuntimeException("No active budget found for " + academicYear);
        }

        // Remaining amount validation
        Double remaining = budget.getRemainingAmount();
        if (remaining == null) remaining = budget.getInitialAmount();

        if (remaining < req.getAllocatedAmount()) {
            throw new RuntimeException("Insufficient remaining budget!");
        }

        // Deduct allocation
        budget.setRemainingAmount(remaining - req.getAllocatedAmount());
        budgetRepo.save(budget);

        // Create event
        Event event = Event.builder()
                .budget(budget)
                .name(req.getName())
                .allocatedAmount(req.getAllocatedAmount())
                .createdBy(creator.getId())
                .createdAt(System.currentTimeMillis())
                .build();

        return eventRepo.save(event);
    }


    public List<Event> getEventsByBudget(Long budgetId) {
        Budget budget = budgetRepo.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        return eventRepo.findByBudget(budget);
    }
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public Event getById(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // UPDATE — adjust difference
    public Event updateEvent(Long id, UpdateEventRequest req) {

        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Budget budget = event.getBudget();

        if (req.getAllocatedAmount() != null) {
            double oldAmount = event.getAllocatedAmount();
            double newAmount = req.getAllocatedAmount();
            double difference = newAmount - oldAmount;

            // If increasing allocation -> check remaining budget
            if (difference > 0 && budget.getRemainingAmount() < difference) {
                throw new RuntimeException("Not enough remaining budget");
            }

            // Apply difference
            budget.setRemainingAmount(budget.getRemainingAmount() - difference);
            budgetRepo.save(budget);

            event.setAllocatedAmount(newAmount);
        }

        if (req.getName() != null) {
            event.setName(req.getName());
        }

        return eventRepo.save(event);
    }

    // DELETE EVENT — refund allocated budget
    public void deleteEvent(Long id) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Budget budget = event.getBudget();

        // Refund allocated amount
        budget.setRemainingAmount(
                budget.getRemainingAmount() + event.getAllocatedAmount()
        );
        budgetRepo.save(budget);

        eventRepo.delete(event);
    }
}
