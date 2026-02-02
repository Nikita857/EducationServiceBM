package com.bm.education.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when file upload fails.
 */
public class FileUploadException extends ApiException {

    public FileUploadException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        initCause(cause);
    }
}
