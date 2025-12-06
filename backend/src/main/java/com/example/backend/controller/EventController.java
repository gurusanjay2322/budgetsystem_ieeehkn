package com.example.backend.controller;

import com.example.backend.dto.CreateEventRequest;
import com.example.backend.dto.UpdateEventRequest;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.service.EventService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    private String getLoggedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // CREATE (Admin + Treasurer)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Event> createEvent(@RequestBody CreateEventRequest req) {
        User creator = userService.getUserByUsername(getLoggedUsername());
        return ResponseEntity.ok(eventService.createEvent(req, creator));
    }

    // GET ALL EVENTS (Everyone logged in)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // GET EVENT BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    // GET EVENTS BY BUDGET
    @GetMapping("/budget/{budgetId}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER','MEMBER')")
    public ResponseEntity<List<Event>> getEventsByBudget(@PathVariable Long budgetId) {
        return ResponseEntity.ok(eventService.getEventsByBudget(budgetId));
    }

    // UPDATE EVENT (Admin + Treasurer)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TREASURER')")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody UpdateEventRequest req) {
        return ResponseEntity.ok(eventService.updateEvent(id, req));
    }

    // DELETE EVENT (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully");
    }
}
