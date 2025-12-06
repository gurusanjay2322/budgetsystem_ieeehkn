package com.example.backend.config;

import com.example.backend.model.Budget;
import com.example.backend.model.User;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialBudgetLoader implements CommandLineRunner {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        String currentYear = "2025-2026"; // Hardcoded for now based on EventService logic

        if (budgetRepository.findByAcademicYear(currentYear) == null) {

            // Need a creator
            User admin = userRepository.findByUsername("admin").orElse(null);
            Long creatorId = (admin != null) ? admin.getId() : 1L;

            Budget budget = Budget.builder()
                    .name("Annual Budget 2025-2026")
                    .academicYear(currentYear)
                    .initialAmount(100000.0)
                    .remainingAmount(100000.0)
                    .createdBy(creatorId)
                    .createdAt(System.currentTimeMillis())
                    .build();

            budgetRepository.save(budget);
            System.out.println("✔ Default budget created for " + currentYear);
        }
    }
}
