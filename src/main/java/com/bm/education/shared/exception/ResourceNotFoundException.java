package com.bm.education.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested resource is not found.
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s с ID: %d не найден", resourceName, id), HttpStatus.NOT_FOUND);
    }
}
