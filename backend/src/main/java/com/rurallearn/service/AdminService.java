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
public class AdminService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public AdminService(UserRepository userRepository, QuizRepository quizRepository,
                        QuestionRepository questionRepository,
                        QuizAttemptRepository quizAttemptRepository) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public Map<String, Object> getDashboard(String email) {
        verifyTeacher(email);

        List<User> students = userRepository.findByRoleOrderByPointsDesc(Role.STUDENT);
        int totalQuizzesCompleted = students.stream()
                .mapToInt(s -> s.getQuizzesCompleted() != null ? s.getQuizzesCompleted() : 0)
                .sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalStudents", students.size());
        result.put("activeQuizzes", quizRepository.countByActiveTrue());
        result.put("quizzesCompleted", totalQuizzesCompleted);
        result.put("averageScore", computeAverageScore());
        result.put("topStudents", students.stream().limit(5).map(this::toStudentSummary).toList());
        result.put("recentActivity", buildRecentActivity(students));
        return result;
    }

    public List<Map<String, Object>> getStudents(String email) {
        verifyTeacher(email);
        return userRepository.findByRoleOrderByPointsDesc(Role.STUDENT).stream()
                .map(this::toStudentSummary)
                .toList();
    }

    public List<Map<String, Object>> getQuizzes(String email) {
        verifyTeacher(email);
        return quizRepository.findAll().stream()
                .sorted(Comparator.comparing(Quiz::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toQuizSummary)
                .toList();
    }

    public Map<String, Object> getQuiz(String email, Long quizId) {
        verifyTeacher(email);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        return toQuizDetail(quiz);
    }

    @Transactional
    public Map<String, Object> createQuiz(String email, CreateQuizRequest request) {
        User teacher = verifyTeacher(email);
        validateQuizRequest(request);

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle().trim());
        quiz.setSubject(request.getSubject());
        quiz.setDifficulty(parseDifficulty(request.getDifficulty()));
        quiz.setPointsReward(request.getPointsReward() != null ? request.getPointsReward() : 50);
        quiz.setTimeLimit(request.getTimeLimit() != null ? request.getTimeLimit() : 10);
        quiz.setTeacherId(teacher.getId());
        quiz.setActive(true);
        quizRepository.save(quiz);

        saveQuestions(quiz.getId(), request.getQuestions());
        return toQuizDetail(quiz);
    }

    @Transactional
    public Map<String, Object> updateQuiz(String email, Long quizId, CreateQuizRequest request) {
        verifyTeacher(email);
        validateQuizRequest(request);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        quiz.setTitle(request.getTitle().trim());
        quiz.setSubject(request.getSubject());
        quiz.setDifficulty(parseDifficulty(request.getDifficulty()));
        quiz.setPointsReward(request.getPointsReward() != null ? request.getPointsReward() : 50);
        quiz.setTimeLimit(request.getTimeLimit() != null ? request.getTimeLimit() : 10);
        quizRepository.save(quiz);

        questionRepository.deleteByQuizId(quizId);
        saveQuestions(quizId, request.getQuestions());
        return toQuizDetail(quiz);
    }

    @Transactional
    public Map<String, Object> toggleQuiz(String email, Long quizId) {
        verifyTeacher(email);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        quiz.setActive(!Boolean.TRUE.equals(quiz.getActive()));
        quizRepository.save(quiz);
        return toQuizSummary(quiz);
    }

    @Transactional
    public void deleteQuiz(String email, Long quizId) {
        verifyTeacher(email);
        if (!quizRepository.existsById(quizId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found");
        }
        questionRepository.deleteByQuizId(quizId);
        quizRepository.deleteById(quizId);
    }

    private void saveQuestions(Long quizId, List<QuestionInput> inputs) {
        if (inputs == null || inputs.isEmpty()) return;
        for (QuestionInput input : inputs) {
            Question q = new Question();
            q.setQuizId(quizId);
            q.setText(input.getText().trim());
            q.setOptionA(input.getOptionA());
            q.setOptionB(input.getOptionB());
            q.setOptionC(input.getOptionC());
            q.setOptionD(input.getOptionD());
            q.setCorrectOption(input.getCorrectOption().toUpperCase());
            questionRepository.save(q);
        }
    }

    private void validateQuizRequest(CreateQuizRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (request.getQuestions() == null || request.getQuestions().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one question is required");
        }
        for (QuestionInput q : request.getQuestions()) {
            if (q.getText() == null || q.getText().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question text is required");
            }
            if (q.getCorrectOption() == null || !List.of("A", "B", "C", "D").contains(q.getCorrectOption().toUpperCase())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correct option must be A, B, C, or D");
            }
        }
    }

    private Difficulty parseDifficulty(String difficulty) {
        if (difficulty == null) return Difficulty.EASY;
        try {
            return Difficulty.valueOf(difficulty.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Difficulty.EASY;
        }
    }

    private int computeAverageScore() {
        List<QuizAttempt> attempts = quizAttemptRepository.findAll();
        if (attempts.isEmpty()) return 0;
        int totalPercent = attempts.stream()
                .mapToInt(a -> a.getTotalQuestions() > 0
                        ? (a.getScore() * 100) / a.getTotalQuestions() : 0)
                .sum();
        return totalPercent / attempts.size();
    }

    private Map<String, Object> toQuizSummary(Quiz quiz) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", quiz.getId());
        m.put("title", quiz.getTitle());
        m.put("subject", quiz.getSubject());
        m.put("difficulty", quiz.getDifficulty().name());
        m.put("pointsReward", quiz.getPointsReward());
        m.put("timeLimit", quiz.getTimeLimit());
        m.put("active", quiz.getActive());
        m.put("questionCount", questionRepository.countByQuizId(quiz.getId()));
        m.put("createdAt", quiz.getCreatedAt());
        return m;
    }

    private Map<String, Object> toQuizDetail(Quiz quiz) {
        Map<String, Object> m = toQuizSummary(quiz);
        List<Map<String, Object>> questions = questionRepository.findByQuizIdOrderByIdAsc(quiz.getId())
                .stream().map(q -> {
                    Map<String, Object> qm = new LinkedHashMap<>();
                    qm.put("id", q.getId());
                    qm.put("text", q.getText());
                    qm.put("optionA", q.getOptionA());
                    qm.put("optionB", q.getOptionB());
                    qm.put("optionC", q.getOptionC());
                    qm.put("optionD", q.getOptionD());
                    qm.put("correctOption", q.getCorrectOption());
                    return qm;
                }).toList();
        m.put("questions", questions);
        return m;
    }

    private Map<String, Object> toStudentSummary(User user) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", user.getId());
        m.put("name", user.getName());
        m.put("email", user.getEmail());
        m.put("grade", user.getGrade());
        m.put("level", user.getLevel());
        m.put("points", user.getPoints());
        m.put("quizzesCompleted", user.getQuizzesCompleted());
        return m;
    }

    private List<Map<String, String>> buildRecentActivity(List<User> students) {
        List<Map<String, String>> activity = new ArrayList<>();
        students.stream().limit(3).forEach(s -> {
            Map<String, String> m = new LinkedHashMap<>();
            m.put("message", s.getName() + " earned " + s.getPoints() + " points");
            m.put("time", "Recently");
            activity.add(m);
        });
        if (activity.isEmpty()) {
            Map<String, String> m = new LinkedHashMap<>();
            m.put("message", "No student activity yet");
            m.put("time", "");
            activity.add(m);
        }
        return activity;
    }

    private User verifyTeacher(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != Role.TEACHER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Teachers only");
        }
        return user;
    }
}
