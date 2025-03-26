package com.moseoh.responseentity.response;

import java.util.List;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Getter
public class PageResult<T> extends CommonResult {
    private final List<T>  data;
    private final Pageable pageable;

    public PageResult(String message, Page<T> pageData) {
        super(false, message);
        this.data = pageData.getContent();
        this.pageable = pageData.getPageable();
    }
}

