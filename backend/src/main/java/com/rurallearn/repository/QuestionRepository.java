package com.rurallearn.repository;

import com.rurallearn.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    long countByQuizId(Long quizId);
    List<Question> findByQuizIdOrderByIdAsc(Long quizId);
    void deleteByQuizId(Long quizId);
}
