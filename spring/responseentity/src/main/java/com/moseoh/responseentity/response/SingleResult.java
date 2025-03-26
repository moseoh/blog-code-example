package com.moseoh.responseentity.response;

import lombok.Getter;

@Getter
public class SingleResult<T> extends CommonResult {
    private final T data;

    public SingleResult(String message, T data) {
        super(false, message);
        this.data = data;
    }
}
