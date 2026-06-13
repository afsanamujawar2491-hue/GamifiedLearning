package com.rurallearn.repository;

import com.rurallearn.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    long countByStudentId(Long studentId);
}
