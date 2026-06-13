package com.rurallearn.controller;

import com.rurallearn.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final StudentService studentService;

    public LeaderboardController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Map<String, Object>> leaderboard() {
        return studentService.getLeaderboard();
    }
}
