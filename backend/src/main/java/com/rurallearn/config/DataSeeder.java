package com.rurallearn.config;

import com.rurallearn.entity.*;
import com.rurallearn.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final BadgeRepository badgeRepository;
    private final StudentBadgeRepository studentBadgeRepository;
    private final GameRepository gameRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, QuizRepository quizRepository,
                      QuestionRepository questionRepository, BadgeRepository badgeRepository,
                      StudentBadgeRepository studentBadgeRepository, GameRepository gameRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.badgeRepository = badgeRepository;
        this.studentBadgeRepository = studentBadgeRepository;
        this.gameRepository = gameRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        String encoded = passwordEncoder.encode("password123");

        User teacher = new User();
        teacher.setName("Mrs. Sharma");
        teacher.setEmail("teacher@school.com");
        teacher.setPassword(encoded);
        teacher.setRole(Role.TEACHER);
        userRepository.save(teacher);

        User student1 = createStudent("Ravi Kumar", "student@school.com", encoded, 7, 450, 3, 5);
        User student2 = createStudent("Priya Singh", "priya@school.com", encoded, 8, 380, 2, 4);
        User student3 = createStudent("Amit Patel", "amit@school.com", encoded, 6, 290, 2, 3);
        User student4 = createStudent("Sunita Devi", "sunita@school.com", encoded, 7, 520, 3, 6);
        userRepository.saveAll(java.util.List.of(student1, student2, student3, student4));

        Badge firstQuiz = createBadge("First Steps", "Completed your first quiz", "🎯", 0);
        Badge mathStar = createBadge("Math Star", "Scored 100% on a math quiz", "⭐", 100);
        Badge streak = createBadge("On Fire", "7-day learning streak", "🔥", 200);
        Badge gameMaster = createBadge("Game Master", "Scored 100% on a learning game", "🎮", 150);
        badgeRepository.saveAll(java.util.List.of(firstQuiz, mathStar, streak, gameMaster));

        assignBadge(student1.getId(), firstQuiz.getId());
        assignBadge(student1.getId(), mathStar.getId());
        assignBadge(student4.getId(), firstQuiz.getId());
        assignBadge(student4.getId(), streak.getId());

        Quiz mathQuiz = createQuiz("Basic Arithmetic", "Mathematics", Difficulty.EASY, 50, 10, teacher.getId());
        Quiz scienceQuiz = createQuiz("Plant Life Cycle", "Science", Difficulty.MEDIUM, 75, 15, teacher.getId());
        Quiz englishQuiz = createQuiz("Grammar Basics", "English", Difficulty.EASY, 40, 10, teacher.getId());
        Quiz geographyQuiz = createQuiz("Indian States", "Geography", Difficulty.HARD, 100, 20, teacher.getId());
        quizRepository.saveAll(java.util.List.of(mathQuiz, scienceQuiz, englishQuiz, geographyQuiz));

        seedMathQuestions(mathQuiz.getId());
        seedScienceQuestions(scienceQuiz.getId());
        seedEnglishQuestions(englishQuiz.getId());
        seedGeographyQuestions(geographyQuiz.getId());

        seedGames();
    }

    private User createStudent(String name, String email, String password, int grade,
                               int points, int level, int quizzesCompleted) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(Role.STUDENT);
        user.setGrade(grade);
        user.setPoints(points);
        user.setLevel(level);
        user.setStreak(3);
        user.setQuizzesCompleted(quizzesCompleted);
        return user;
    }

    private Badge createBadge(String name, String desc, String icon, int pointsRequired) {
        Badge badge = new Badge();
        badge.setName(name);
        badge.setDescription(desc);
        badge.setIcon(icon);
        badge.setPointsRequired(pointsRequired);
        return badge;
    }

    private void assignBadge(Long studentId, Long badgeId) {
        StudentBadge sb = new StudentBadge();
        sb.setStudentId(studentId);
        sb.setBadgeId(badgeId);
        studentBadgeRepository.save(sb);
    }

    private Quiz createQuiz(String title, String subject, Difficulty difficulty,
                            int points, int timeLimit, Long teacherId) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setSubject(subject);
        quiz.setDifficulty(difficulty);
        quiz.setPointsReward(points);
        quiz.setTimeLimit(timeLimit);
        quiz.setTeacherId(teacherId);
        return quiz;
    }

    private void seedMathQuestions(Long quizId) {
        questionRepository.saveAll(java.util.List.of(
            createQuestion(quizId, "What is 15 + 27?", "40", "42", "43", "41", "B"),
            createQuestion(quizId, "What is 8 × 7?", "54", "56", "58", "48", "B"),
            createQuestion(quizId, "What is 100 ÷ 4?", "20", "30", "25", "40", "C")
        ));
    }

    private void seedScienceQuestions(Long quizId) {
        questionRepository.saveAll(java.util.List.of(
            createQuestion(quizId, "What do plants need to make food?", "Water only", "Sunlight, water and air", "Soil only", "Wind only", "B"),
            createQuestion(quizId, "Which part of a plant absorbs water?", "Leaf", "Flower", "Root", "Fruit", "C"),
            createQuestion(quizId, "What gas do plants release during photosynthesis?", "Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen", "C")
        ));
    }

    private void seedEnglishQuestions(Long quizId) {
        questionRepository.saveAll(java.util.List.of(
            createQuestion(quizId, "Which word is a noun?", "Run", "Happy", "Book", "Quickly", "C"),
            createQuestion(quizId, "Choose the correct sentence:", "She go to school.", "She goes to school.", "She going to school.", "She gone to school.", "B"),
            createQuestion(quizId, "What is the past tense of 'eat'?", "Eated", "Eating", "Ate", "Eats", "C")
        ));
    }

    private void seedGeographyQuestions(Long quizId) {
        questionRepository.saveAll(java.util.List.of(
            createQuestion(quizId, "What is the capital of India?", "Mumbai", "New Delhi", "Kolkata", "Chennai", "B"),
            createQuestion(quizId, "Which is the largest state in India by area?", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "B"),
            createQuestion(quizId, "Which river is known as the Ganga?", "Yamuna", "Godavari", "Ganges", "Narmada", "C")
        ));
    }

    private Question createQuestion(Long quizId, String text, String a, String b, String c, String d, String correct) {
        Question q = new Question();
        q.setQuizId(quizId);
        q.setText(text);
        q.setOptionA(a);
        q.setOptionB(b);
        q.setOptionC(c);
        q.setOptionD(d);
        q.setCorrectOption(correct);
        return q;
    }

    private void seedGames() {
        gameRepository.saveAll(java.util.List.of(
            createGame("math-sprint", "Math Sprint", "Mathematics",
                "Solve as many math problems as you can in 60 seconds!", 50, "🔢"),
            createGame("word-builder", "Word Builder", "English",
                "Build words from scrambled letters to improve vocabulary.", 40, "📝"),
            createGame("science-match", "Science Match", "Science",
                "Match scientific terms with their correct definitions.", 45, "🔬"),
            createGame("map-explorer", "Map Explorer", "Geography",
                "Identify states and landmarks across India.", 55, "🗺️")
        ));
    }

    private Game createGame(String slug, String title, String subject, String desc, int points, String emoji) {
        Game game = new Game();
        game.setSlug(slug);
        game.setTitle(title);
        game.setSubject(subject);
        game.setDescription(desc);
        game.setPointsReward(points);
        game.setEmoji(emoji);
        return game;
    }
}
