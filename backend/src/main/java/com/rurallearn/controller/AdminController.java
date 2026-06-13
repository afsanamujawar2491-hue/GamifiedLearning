package com.rurallearn.controller;

import com.rurallearn.dto.CreateQuizRequest;
import com.rurallearn.service.AdminService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@AuthenticationPrincipal String email) {
        return adminService.getDashboard(email);
    }

    @GetMapping("/students")
    public List<Map<String, Object>> students(@AuthenticationPrincipal String email) {
        return adminService.getStudents(email);
    }

    @GetMapping("/quizzes")
    public List<Map<String, Object>> quizzes(@AuthenticationPrincipal String email) {
        return adminService.getQuizzes(email);
    }

    @GetMapping("/quizzes/{id}")
    public Map<String, Object> getQuiz(@AuthenticationPrincipal String email, @PathVariable Long id) {
        return adminService.getQuiz(email, id);
    }

    @PostMapping("/quizzes")
    public Map<String, Object> createQuiz(@AuthenticationPrincipal String email,
                                          @RequestBody CreateQuizRequest request) {
        return adminService.createQuiz(email, request);
    }

    @PutMapping("/quizzes/{id}")
    public Map<String, Object> updateQuiz(@AuthenticationPrincipal String email,
                                          @PathVariable Long id,
                                          @RequestBody CreateQuizRequest request) {
        return adminService.updateQuiz(email, id, request);
    }

    @PatchMapping("/quizzes/{id}/toggle")
    public Map<String, Object> toggleQuiz(@AuthenticationPrincipal String email, @PathVariable Long id) {
        return adminService.toggleQuiz(email, id);
    }

    @DeleteMapping("/quizzes/{id}")
    public void deleteQuiz(@AuthenticationPrincipal String email, @PathVariable Long id) {
        adminService.deleteQuiz(email, id);
    }
}
