package com.bm.education.api;

import java.util.Map;

public record ApiResponse<T>(boolean success, String message, T data, Map<String, String> errors) {

    // Успешный ответ с данными
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    // Успешный ответ без данных
    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    // Ошибка с сообщением
    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    // Ошибка валидации с детальными ошибками
    public static ApiResponse<Void> validationError(Map<String, String> errors) {
        return new ApiResponse<>(false, "Ошибка валидации", null, errors);
    }

    // Успешный ответ с данными без сообщения
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data, null);
    }
}