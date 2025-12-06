package com.example.backend.service;

import com.example.backend.dto.CreateBudgetRequest;
import com.example.backend.dto.UpdateBudgetRequest;
import com.example.backend.model.Budget;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepo;

    public Budget createBudget(CreateBudgetRequest req, Long adminId) {

        // Ensure academic year is unique
        if (budgetRepo.findByAcademicYear(req.getAcademicYear()) != null) {
            throw new RuntimeException("Budget for this academic year already exists!");
        }

        Budget budget = Budget.builder()
                .name(req.getName())
                .academicYear(req.getAcademicYear())
                .initialAmount(req.getInitialAmount())
                .remainingAmount(req.getInitialAmount())   // ⭐ FIX
                .createdBy(adminId)
                .createdAt(System.currentTimeMillis())
                .build();


        return budgetRepo.save(budget);
    }

    public Budget getById(Long id) {
        return budgetRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }
    public String getCurrentAcademicYearString() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }

    public Budget updateBudget(Long id, UpdateBudgetRequest req, User loggedUser) {
        Budget budget = getById(id);

        // Only ADMIN can change amounts + academic year
        if (loggedUser.getRole() == Role.TREASURER) {

            if (req.getInitialAmount() != null ||
                    req.getAcademicYear() != null) {

                throw new RuntimeException("Treasurers cannot modify budget amount or academic year.");
            }
        }

        if (req.getName() != null) budget.setName(req.getName());

        // If admin updates initial amount — adjust remaining too
        if (req.getInitialAmount() != null) {
            double difference = req.getInitialAmount() - budget.getInitialAmount();
            budget.setInitialAmount(req.getInitialAmount());
            budget.setRemainingAmount(budget.getRemainingAmount() + difference);
        }

        if (req.getAcademicYear() != null) {
            budget.setAcademicYear(req.getAcademicYear());
        }

        return budgetRepo.save(budget);
    }

    public void deleteBudget(Long id) {
        budgetRepo.delete(getById(id));
    }

    public java.util.List<Budget> getAll() {
        return budgetRepo.findAll();
    }

    public Budget getCurrentAcademicYearBudget() {
        return budgetRepo.findByAcademicYear(determineAcademicYear());
    }

    private String determineAcademicYear() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }
}
