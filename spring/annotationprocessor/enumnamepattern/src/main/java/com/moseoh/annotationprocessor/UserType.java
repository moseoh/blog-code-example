package com.moseoh.annotationprocessor;

@EnumNamePattern(value = "^.*_(ADMIN|MANAGER)$")
public enum UserType {
    TEST_ADMIN,
    TEST_MANAGER,

    TEST_FAILED,
    TEST_failed,
}
