package com.moseoh.sample.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.moseoh.sample.entity.Board;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    @Query("SELECT b FROM Board b ORDER BY b.id DESC LIMIT 1")
    Optional<Board> findLatest();
}