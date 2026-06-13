package com.rurallearn.service;

import com.rurallearn.entity.Badge;
import com.rurallearn.entity.StudentBadge;
import com.rurallearn.entity.User;
import com.rurallearn.repository.BadgeRepository;
import com.rurallearn.repository.StudentBadgeRepository;
import com.rurallearn.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class GamificationService {

    public static final int POINTS_PER_LEVEL = 200;

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final StudentBadgeRepository studentBadgeRepository;

    public GamificationService(UserRepository userRepository, BadgeRepository badgeRepository,
                               StudentBadgeRepository studentBadgeRepository) {
        this.userRepository = userRepository;
        this.badgeRepository = badgeRepository;
        this.studentBadgeRepository = studentBadgeRepository;
    }

    public int calculatePointsEarned(int score, int total, int maxPoints) {
        if (total <= 0) return 0;
        int scorePercent = (score * 100) / total;
        return (scorePercent * maxPoints) / 100;
    }

    public void applyPoints(User user, int pointsEarned) {
        user.setPoints(user.getPoints() + pointsEarned);
        user.setLevel((user.getPoints() / POINTS_PER_LEVEL) + 1);
        userRepository.save(user);
    }

    public void incrementStreak(User user) {
        user.setStreak(user.getStreak() + 1);
        userRepository.save(user);
    }

    public List<Map<String, Object>> awardQuizBadges(User user, String subject, int scorePercent,
                                                     boolean wasFirstQuiz) {
        List<Map<String, Object>> earned = new ArrayList<>();
        if (wasFirstQuiz) {
            earnBadge(user.getId(), "First Steps", earned);
        }
        if (scorePercent == 100 && "Mathematics".equalsIgnoreCase(subject)) {
            earnBadge(user.getId(), "Math Star", earned);
        }
        if (user.getStreak() >= 7) {
            earnBadge(user.getId(), "On Fire", earned);
        }
        return earned;
    }

    public List<Map<String, Object>> awardGameBadges(User user, int scorePercent) {
        List<Map<String, Object>> earned = new ArrayList<>();
        if (scorePercent == 100) {
            earnBadge(user.getId(), "Game Master", earned);
        }
        if (user.getStreak() >= 7) {
            earnBadge(user.getId(), "On Fire", earned);
        }
        return earned;
    }

    public List<Map<String, Object>> getBadgesForStudent(Long studentId) {
        return studentBadgeRepository.findByStudentId(studentId).stream().map(sb -> {
            Badge badge = badgeRepository.findById(sb.getBadgeId()).orElse(null);
            if (badge == null) return null;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", badge.getId());
            m.put("name", badge.getName());
            m.put("description", badge.getDescription());
            m.put("icon", badge.getIcon());
            return m;
        }).filter(Objects::nonNull).toList();
    }

    private void earnBadge(Long studentId, String badgeName, List<Map<String, Object>> earned) {
        badgeRepository.findAll().stream()
                .filter(b -> badgeName.equals(b.getName()))
                .findFirst()
                .ifPresent(badge -> {
                    if (!studentBadgeRepository.existsByStudentIdAndBadgeId(studentId, badge.getId())) {
                        StudentBadge sb = new StudentBadge();
                        sb.setStudentId(studentId);
                        sb.setBadgeId(badge.getId());
                        studentBadgeRepository.save(sb);

                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", badge.getId());
                        m.put("name", badge.getName());
                        m.put("description", badge.getDescription());
                        m.put("icon", badge.getIcon());
                        earned.add(m);
                    }
                });
    }
}
