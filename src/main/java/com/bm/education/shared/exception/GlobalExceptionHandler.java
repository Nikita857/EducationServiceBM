package com.bm.education.shared.exception;

import com.bm.education.shared.common.ApiResponse;

import lombok.extern.slf4j.Slf4j;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ApiResponse<Void> handleValidationException(@NotNull ValidationException ex) {
        return ApiResponse.validationError(ex.getErrors());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationExceptions(@NotNull MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ApiResponse.validationError(errors);
    }

    // Обработчик для 404 Not Found (когда не найден обработчик для запроса)
    @ExceptionHandler(NoHandlerFoundException.class)
    public ApiResponse<Void> handleNoHandlerFoundException() {
        return ApiResponse.error("Запрашиваемый ресурс не найден", HttpStatus.NOT_FOUND);
    }

    // Общий обработчик для ResponseStatusException, который может быть выброшен с
    // HttpStatus.NOT_FOUND
    @ExceptionHandler(ResponseStatusException.class)
    public ApiResponse<Void> handleResponseStatusException(@NotNull ResponseStatusException ex) {
        return ApiResponse.error(ex.getReason() != null ? ex.getReason() : ex.getMessage(),
                (HttpStatus) ex.getStatusCode());
    }

    @ExceptionHandler(ApiException.class)
    public ApiResponse<Void> handleApiException(@NotNull ApiException ex) {
        return ApiResponse.error(ex.getMessage(), (HttpStatus) ex.getStatus());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ApiResponse<Void> handleMaxSizeException() {
        return ApiResponse.error("Размер файла превышает допустимый лимит (5MB)", HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ApiResponse<Void> handleAccessDeniedException() {
        return ApiResponse.error("У вас нет прав для доступа к этому ресурсу.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ApiResponse<Void> handleBadCredentialsException() {
        return ApiResponse.error("Неверный логин или пароль", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        log.error("Internal server error", e);
        return ApiResponse.error("Внутренняя ошибка сервера: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}