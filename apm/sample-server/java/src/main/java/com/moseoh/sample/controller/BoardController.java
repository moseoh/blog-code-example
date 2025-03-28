package com.moseoh.sample.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moseoh.sample.dto.BoardRequest;
import com.moseoh.sample.entity.Board;
import com.moseoh.sample.repository.BoardRepository;
import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardRepository boardRepository;

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody BoardRequest request) {
        Board board = new Board(request.getTitle(), request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(boardRepository.save(board));
    }

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardRepository
                                         .findById(id)
                                         .orElseThrow(() -> new RuntimeException("Board not found")));
    }

    @GetMapping("/latest")
    public ResponseEntity<Board> getBoardLatest() {
        return ResponseEntity.ok(boardRepository
                                         .findLatest()
                                         .orElseThrow(() -> new RuntimeException("Board not found")));
    }
} 