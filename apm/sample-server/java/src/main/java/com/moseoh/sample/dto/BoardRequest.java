package com.moseoh.sample.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardRequest {
    private String title;
    private String content;
} 