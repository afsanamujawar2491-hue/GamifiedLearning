package com.rurallearn.service;

import com.rurallearn.dto.CreateQuizRequest;
import com.rurallearn.dto.QuestionInput;
import com.rurallearn.entity.*;
import com.rurallearn.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class StudentService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final GamificationService gamificationService;

    public StudentService(UserRepository userRepository, QuizRepository quizRepository,
                          QuestionRepository questionRepository,
                          QuizAttemptRepository quizAttemptRepository,
                          GamificationService gamificationService) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.gamificationService = gamificationService;
    }

    public Map<String, Object> getDashboard(String email) {
        User user = getStudent(email);
        int pointsPerLevel = GamificationService.POINTS_PER_LEVEL;
        int currentLevelPoints = (user.getLevel() - 1) * pointsPerLevel;
        int progressInLevel = user.getPoints() - currentLevelPoints;
        int levelProgress = Math.min(100, (progressInLevel * 100) / pointsPerLevel);
        int pointsToNext = pointsPerLevel - progressInLevel;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("points", user.getPoints());
        result.put("level", user.getLevel());
        result.put("streak", user.getStreak());
        result.put("quizzesCompleted", user.getQuizzesCompleted());
        result.put("rank", userRepository.findRankByPoints(user.getPoints()));
        result.put("levelProgress", levelProgress);
        result.put("pointsToNextLevel", Math.max(0, pointsToNext));
        result.put("badges", gamificationService.getBadgesForStudent(user.getId()));
        return result;
    }

    public List<Map<String, Object>> getQuizzes() {
        return quizRepository.findByActiveTrue().stream().map(quiz -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", quiz.getId());
            m.put("title", quiz.getTitle());
            m.put("subject", quiz.getSubject());
            m.put("difficulty", quiz.getDifficulty().name());
            m.put("pointsReward", quiz.getPointsReward());
            m.put("timeLimit", quiz.getTimeLimit());
            m.put("questionCount", questionRepository.countByQuizId(quiz.getId()));
            return m;
        }).toList();
    }

    public Map<String, Object> getQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        if (!Boolean.TRUE.equals(quiz.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not available");
        }

        List<Map<String, Object>> questions = questionRepository.findByQuizIdOrderByIdAsc(quizId).stream()
                .map(q -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", q.getId());
                    m.put("text", q.getText());
                    m.put("optionA", q.getOptionA());
                    m.put("optionB", q.getOptionB());
                    m.put("optionC", q.getOptionC());
                    m.put("optionD", q.getOptionD());
                    return m;
                }).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", quiz.getId());
        result.put("title", quiz.getTitle());
        result.put("subject", quiz.getSubject());
        result.put("difficulty", quiz.getDifficulty().name());
        result.put("pointsReward", quiz.getPointsReward());
        result.put("timeLimit", quiz.getTimeLimit());
        result.put("questions", questions);
        return result;
    }

    @Transactional
    public Map<String, Object> submitQuiz(String email, Long quizId,
                                            com.rurallearn.dto.QuizSubmitRequest request) {
        User user = getStudent(email);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        List<Question> questions = questionRepository.findByQuizIdOrderByIdAsc(quizId);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quiz has no questions");
        }

        Map<String, String> answers = request.getAnswers() != null ? request.getAnswers() : Map.of();
        int correct = 0;
        List<Map<String, Object>> review = new ArrayList<>();

        for (Question q : questions) {
            String submitted = answers.get(String.valueOf(q.getId()));
            boolean isCorrect = q.getCorrectOption() != null
                    && q.getCorrectOption().equalsIgnoreCase(submitted);
            if (isCorrect) correct++;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("questionId", q.getId());
            item.put("correct", isCorrect);
            item.put("correctOption", q.getCorrectOption());
            item.put("yourAnswer", submitted);
            review.add(item);
        }

        int total = questions.size();
        int scorePercent = (correct * 100) / total;
        int pointsEarned = gamificationService.calculatePointsEarned(correct, total, quiz.getPointsReward());

        boolean wasFirstQuiz = user.getQuizzesCompleted() == 0;

        QuizAttempt attempt = new QuizAttempt();
        attempt.setStudentId(user.getId());
        attempt.setQuizId(quizId);
        attempt.setScore(correct);
        attempt.setTotalQuestions(total);
        attempt.setPointsEarned(pointsEarned);
        quizAttemptRepository.save(attempt);

        user.setQuizzesCompleted(user.getQuizzesCompleted() + 1);
        gamificationService.applyPoints(user, pointsEarned);
        gamificationService.incrementStreak(user);

        List<Map<String, Object>> newBadges = gamificationService.awardQuizBadges(
                user, quiz.getSubject(), scorePercent, wasFirstQuiz);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", correct);
        result.put("total", total);
        result.put("scorePercent", scorePercent);
        result.put("pointsEarned", pointsEarned);
        result.put("totalPoints", user.getPoints());
        result.put("level", user.getLevel());
        result.put("newBadges", newBadges);
        result.put("review", review);
        return result;
    }

    public List<Map<String, Object>> getLeaderboard() {
        return userRepository.findByRoleOrderByPointsDesc(Role.STUDENT).stream()
                .limit(20)
                .map(user -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", user.getId());
                    m.put("name", user.getName());
                    m.put("grade", user.getGrade());
                    m.put("level", user.getLevel());
                    m.put("points", user.getPoints());
                    return m;
                }).toList();
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
