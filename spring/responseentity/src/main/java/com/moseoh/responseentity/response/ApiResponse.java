package com.moseoh.responseentity.response;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.moseoh.responseentity.exception.ApiException;

public class ApiResponse {

    // ------
    // Success
    // ------

    public static <T> ResponseEntity<SingleResult<T>> of(HttpStatus status, T data) {
        return ApiResponse.of(status, null, data);
    }

    public static <T> ResponseEntity<ListResult<T>> of(HttpStatus status, List<T> data) {
        return ApiResponse.of(status, null, data);
    }

    public static <T> ResponseEntity<PageResult<T>> of(HttpStatus status, Page<T> data) {
        return ApiResponse.of(status, null, data);
    }

    public static <T> ResponseEntity<SingleResult<T>> of(HttpStatus status, String message, T data) {
        return ResponseEntity.status(status).body(new SingleResult<>(message, data));
    }

    public static <T> ResponseEntity<ListResult<T>> of(HttpStatus status, String message, List<T> data) {
        return ResponseEntity.status(status).body(new ListResult<>(message, data));
    }

    public static <T> ResponseEntity<PageResult<T>> of(HttpStatus status, String message, Page<T> data) {
        return ResponseEntity.status(status).body(new PageResult<>(message, data));
    }

    // ------
    // Failed
    // ------

    public static ResponseEntity<CommonResult> failedOf(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new CommonResult(true, message));
    }

    public static ResponseEntity<CommonResult> failedOf(ApiException e) {
        return ResponseEntity.status(e.status).body(new CommonResult(true, e.getMessage()));
    }
}
