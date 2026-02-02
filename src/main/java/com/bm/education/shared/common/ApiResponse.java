package com.bm.education.shared.common;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

/**
 * A generic API response that extends ResponseEntity to allow direct return
 * from controllers.
 *
 * @param <T> The type of the data in the response.
 */
public class ApiResponse<T> extends ResponseEntity<ApiResponse.Payload<T>> {

    /**
     * The actual body of the response.
     */
    public record Payload<T>(boolean success, String message, T data, Map<String, String> errors) {
    }

    /**
     * Nested record to hold the data for a paginated response.
     */
    public record PaginatedPayload<C>(
            List<C> content,
            int currentPage,
            int totalPages,
            long totalItems,
            int pageSize) {
    }

    public ApiResponse(HttpStatus status, boolean success, String message, T data, Map<String, String> errors) {
        super(new Payload<>(success, message, data, errors), status);
    }

    public static <T> @NotNull ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(HttpStatus.OK, true, message, data, null);
    }

    public static <T> @NotNull ApiResponse<T> success(T data) {
        return new ApiResponse<>(HttpStatus.OK, true, null, data, null);
    }

    public static @NotNull ApiResponse<Void> success(String message) {
        return new ApiResponse<>(HttpStatus.OK, true, message, null, null);
    }

    public static <T> @NotNull ApiResponse<T> error(String message, HttpStatus status) {
        return new ApiResponse<>(status, false, message, null, null);
    }

    public static <T> @NotNull ApiResponse<T> error(String message) {
        return error(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static @NotNull ApiResponse<Void> validationError(Map<String, String> errors) {
        return new ApiResponse<>(HttpStatus.BAD_REQUEST, false, "Ошибка валидации", null, errors);
    }

    public static <E> @NotNull ApiResponse<PaginatedPayload<E>> paginated(@NotNull Page<E> page) {
        PaginatedPayload<E> payload = new PaginatedPayload<>(
                page.getContent(),
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements(),
                page.getSize());
        return new ApiResponse<>(HttpStatus.OK, true, "Данные успешно получены", payload, null);
    }
}