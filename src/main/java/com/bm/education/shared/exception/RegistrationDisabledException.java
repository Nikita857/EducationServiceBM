package com.bm.education.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when registration is disabled.
 */
public class RegistrationDisabledException extends ApiException {

    public RegistrationDisabledException() {
        super("Регистрация в данный момент отключена.", HttpStatus.FORBIDDEN);
    }
}
