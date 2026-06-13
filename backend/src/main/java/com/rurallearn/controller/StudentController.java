package com.rurallearn.controller;

import com.rurallearn.dto.GameSubmitRequest;
import com.rurallearn.dto.QuizSubmitRequest;
import com.rurallearn.service.GameService;
import com.rurallearn.service.StudentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;
    private final GameService gameService;

    public StudentController(StudentService studentService, GameService gameService) {
        this.studentService = studentService;
        this.gameService = gameService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@AuthenticationPrincipal String email) {
        return studentService.getDashboard(email);
    }

    @GetMapping("/quizzes")
    public List<Map<String, Object>> quizzes() {
        return studentService.getQuizzes();
    }

    @GetMapping("/quizzes/{id}")
    public Map<String, Object> getQuiz(@PathVariable Long id) {
        return studentService.getQuiz(id);
    }

    @PostMapping("/quizzes/{id}/submit")
    public Map<String, Object> submitQuiz(
            @AuthenticationPrincipal String email,
            @PathVariable Long id,
            @RequestBody QuizSubmitRequest request) {
        return studentService.submitQuiz(email, id, request);
    }

    @GetMapping("/games")
    public List<Map<String, Object>> games() {
        return gameService.getGames();
    }

    @GetMapping("/games/{slug}")
    public Map<String, Object> getGame(@PathVariable String slug) {
        return gameService.getGame(slug);
    }

    @PostMapping("/games/{slug}/submit")
    public Map<String, Object> submitGame(
            @AuthenticationPrincipal String email,
            @PathVariable String slug,
            @RequestBody GameSubmitRequest request) {
        return gameService.submitGame(email, slug, request);
    }
}
