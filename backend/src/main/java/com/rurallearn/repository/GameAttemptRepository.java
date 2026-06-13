package com.rurallearn.repository;

import com.rurallearn.entity.GameAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameAttemptRepository extends JpaRepository<GameAttempt, Long> {
}
