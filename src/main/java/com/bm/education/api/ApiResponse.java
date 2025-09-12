package com.bm.education.api;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public record ApiResponse<T>(boolean success, String message, T data, Map<String, String> errors) {

    // Успешный ответ с данными
    @Contract("_, _ -> new")
    public static <T> @NotNull ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    // Успешный ответ без данных
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    // Ошибка с сообщением
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    /**
     *
     * @param errors Map of filed errors
     * @return new API Response validation error response with Map of errors
     */
    @Contract("_ -> new")
    public static @NotNull ApiResponse<Void> validationError(Map<String, String> errors) {
        return new ApiResponse<>(false, "Ошибка валидации", null, errors);
    }

    /**
     * Successful API Response
     * @param <T> The type of object that you send
     */
    @Contract("_ -> new")
    public static <T> @NotNull ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data, null);
    }

    /**
     * A nested record to hold the data for a paginated response.
     * @param <C> The type of the content in the page.
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
