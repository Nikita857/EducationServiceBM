package com.bm.education.api;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 * A generic API response.
 *
 * @param <T> The type of the data in the response.
 * @param success Whether the request was successful.
 * @param message A message describing the result of the request.
 * @param data The data returned by the request.
 * @param errors A map of validation errors.
 */
public record ApiResponse<T>(boolean success, String message, T data, Map<String, String> errors) {

    /**
     * Creates a successful response with data.
     *
     * @param message A message describing the result of the request.
     * @param data The data returned by the request.
     * @param <T> The type of the data in the response.
     * @return A new ApiResponse object.
     */
    @Contract("_, _ -> new")
    public static <T> @NotNull ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    /**
     * Creates a successful response without data.
     *
     * @param message A message describing the result of the request.
     * @return A new ApiResponse object.
     */
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    /**
     * Creates an error response with a message.
     *
     * @param message A message describing the error.
     * @return A new ApiResponse object.
     */
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    /**
     * Creates a validation error response.
     *
     * @param errors A map of validation errors.
     * @return A new ApiResponse object.
     */
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> validationError(Map<String, String> errors) {
        return new ApiResponse<>(false, "Ошибка валидации", null, errors);
    }

    /**
     * Creates a successful response with data.
     *
     * @param data The data returned by the request.
     * @param <T> The type of the data in the response.
     * @return A new ApiResponse object.
     */
    @Contract("_ -> new")
    public static <T> @NotNull ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data, null);
    }

    /**
     * A nested record to hold the data for a paginated response.
     * @param <C> The type of the content in the page.
     * @param content The content of the page.
     * @param currentPage The current page number.
     * @param totalPages The total number of pages.
     * @param totalItems The total number of items.
     * @param pageSize The page size.
     */
    public record PaginatedPayload<C>(
            List<C> content,
            int currentPage,
            int totalPages,
            long totalItems,
            int pageSize
    ) {}

    /**
     * Creates a successful paginated response.
     *
     * @param page The Page object from Spring Data.
     * @param <E> The type of the elements in the page.
     * @return An ApiResponse containing the paginated payload.
     */
    public static <E> @NotNull ApiResponse<PaginatedPayload<E>> paginated(@NotNull Page<E> page) {
        PaginatedPayload<E> payload = new PaginatedPayload<>(
                page.getContent(),
                page.getNumber() + 1, // Front-end is usually 1-based
                page.getTotalPages(),
                page.getTotalElements(),
                page.getSize()
        );
        return new ApiResponse<>(true, "Данные успешно получены", payload, null);
    }
}