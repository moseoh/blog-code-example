package com.moseoh.annotationprocessor;

import com.moseoh.processor.EnumNamePattern;

@EnumNamePattern(value = "^.*_(ADMIN|MANAGER)$")
public enum UserType {
    TEST_ADMIN,
    TEST_MANAGER,
}

