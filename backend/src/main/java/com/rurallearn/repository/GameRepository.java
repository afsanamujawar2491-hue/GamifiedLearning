package com.rurallearn.repository;

import com.rurallearn.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByActiveTrue();
    Optional<Game> findBySlug(String slug);
}
