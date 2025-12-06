package com.example.backend.service;

import com.example.backend.dto.CreateDeadlineRequest;
import com.example.backend.model.Deadline;
import com.example.backend.repository.DeadlineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeadlineService {

    private final DeadlineRepository deadlineRepository;

    public Deadline createDeadline(CreateDeadlineRequest req, Long userId) {
        Deadline deadline = Deadline.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .dueTimestamp(req.getDueTimestamp())
                .createdBy(userId)
                .createdAt(System.currentTimeMillis())
                .build();
        return deadlineRepository.save(deadline);
    }

    public List<Deadline> getAllDeadlines() {
        return deadlineRepository.findAll();
    }

    public void deleteDeadline(Long id) {
        deadlineRepository.deleteById(id);
    }
}
