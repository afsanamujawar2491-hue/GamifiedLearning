package com.rurallearn.service;

import com.rurallearn.dto.GameSubmitRequest;
import com.rurallearn.entity.*;
import com.rurallearn.repository.GameAttemptRepository;
import com.rurallearn.repository.GameRepository;
import com.rurallearn.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class GameService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameAttemptRepository gameAttemptRepository;
    private final GamificationService gamificationService;

    public GameService(UserRepository userRepository, GameRepository gameRepository,
                       GameAttemptRepository gameAttemptRepository,
                       GamificationService gamificationService) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gameAttemptRepository = gameAttemptRepository;
        this.gamificationService = gamificationService;
    }

    public List<Map<String, Object>> getGames() {
        return gameRepository.findByActiveTrue().stream().map(this::toGameSummary).toList();
    }

    public Map<String, Object> getGame(String slug) {
        Game game = gameRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));
        if (!Boolean.TRUE.equals(game.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not available");
        }
        return toGameSummary(game);
    }

    @Transactional
    public Map<String, Object> submitGame(String email, String slug, GameSubmitRequest request) {
        User user = getStudent(email);
        Game game = gameRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        int score = request.getScore() != null ? Math.max(0, request.getScore()) : 0;
        int total = request.getTotal() != null ? Math.max(1, request.getTotal()) : 1;
        score = Math.min(score, total);

        int scorePercent = (score * 100) / total;
        int pointsEarned = gamificationService.calculatePointsEarned(score, total, game.getPointsReward());

        GameAttempt attempt = new GameAttempt();
        attempt.setStudentId(user.getId());
        attempt.setGameId(game.getId());
        attempt.setScore(score);
        attempt.setTotal(total);
        attempt.setPointsEarned(pointsEarned);
        gameAttemptRepository.save(attempt);

        gamificationService.applyPoints(user, pointsEarned);
        gamificationService.incrementStreak(user);

        List<Map<String, Object>> newBadges = gamificationService.awardGameBadges(user, scorePercent);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", score);
        result.put("total", total);
        result.put("scorePercent", scorePercent);
        result.put("pointsEarned", pointsEarned);
        result.put("totalPoints", user.getPoints());
        result.put("level", user.getLevel());
        result.put("newBadges", newBadges);
        return result;
    }

    private Map<String, Object> toGameSummary(Game game) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", game.getId());
        m.put("slug", game.getSlug());
        m.put("title", game.getTitle());
        m.put("subject", game.getSubject());
        m.put("description", game.getDescription());
        m.put("pointsReward", game.getPointsReward());
        m.put("emoji", game.getEmoji());
        return m;
    }

    private User getStudent(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Students only");
        }
        return user;
    }
}
