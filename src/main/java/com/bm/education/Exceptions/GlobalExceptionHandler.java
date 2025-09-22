package com.bm.education.Exceptions;

import com.bm.education.api.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.ui.Model;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(@NotNull ApiException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage());
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(@NotNull MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse error = new ErrorResponse("Validation failed", errors);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Обработчик для 404 Not Found (когда не найден обработчик для запроса)
    @ExceptionHandler(NoHandlerFoundException.class)
    public String handleNoHandlerFoundException(@NotNull Model model) {
        model.addAttribute("status", HttpStatus.NOT_FOUND.value());
        model.addAttribute("error", "Страница не найдена");
        model.addAttribute("message", "Запрашиваемая страница не существует.");
        return "error/404";
    }

    // Общий обработчик для ResponseStatusException, который может быть выброшен с HttpStatus.NOT_FOUND
    @ExceptionHandler(ResponseStatusException.class)
    public String handleResponseStatusException(@NotNull ResponseStatusException ex, Model model) {
        if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
            model.addAttribute("status", HttpStatus.NOT_FOUND.value());
            model.addAttribute("error", "Страница не найдена");
            model.addAttribute("message", "Запрашиваемая страница не существует.");
            return "error/404";
        }
        // Для других статусов можно вернуть общий обработчик ошибок или специфичный
        model.addAttribute("status", ex.getStatusCode().value());
        model.addAttribute("error", ex.getReason());
        model.addAttribute("message", ex.getMessage());
        return "error/500"; // Или другой шаблон для общих ошибок
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException() {
        ErrorResponse error = new ErrorResponse("Размер файла превышает допустимый лимит (5MB)");
        return new ResponseEntity<>(error, HttpStatus.PAYLOAD_TOO_LARGE); // 413 Payload Too Large
    }

    @ExceptionHandler(AccessDeniedException.class)
    public String handleAccessDeniedException(@NotNull Model model) {
        model.addAttribute("status", HttpStatus.FORBIDDEN.value());
        model.addAttribute("error", "Доступ запрещен");
        model.addAttribute("message", "У вас нет прав для доступа к этой странице.");
        return "error/403";
    }
}