package com.rurallearn.repository;

import com.rurallearn.entity.Role;
import com.rurallearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleOrderByPointsDesc(Role role);

    @Query("SELECT COUNT(u) + 1 FROM User u WHERE u.role = 'STUDENT' AND u.points > :points")
    int findRankByPoints(int points);
}
