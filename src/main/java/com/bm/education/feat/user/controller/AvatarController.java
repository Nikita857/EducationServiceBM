package com.bm.education.feat.user.controller;

import com.bm.education.feat.storage.service.MinioService;
import com.bm.education.feat.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;
import java.util.List;

/**
 * Controller for handling avatar-related requests.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class AvatarController {

    private final UserService userService;
    private final MinioService minioService;

    private final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif",
            "image/webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Uploads an avatar for the authenticated user.
     *
     * @param user               The authentication object for the current user.
     * @param file               The avatar file to upload.
     * @param redirectAttributes The redirect attributes to add flash attributes to.
     * @return A redirect to the user's cabinet page.
     */
    @PostMapping("/profile/avatar/upload")
    public String uploadAvatar(Authentication user,
            @RequestParam("avatar") MultipartFile file,
            RedirectAttributes redirectAttributes) {

        try {
            // Валидация файла
            validateFile(file);

            // Сохраняем файл в MinIO
            String fileName = minioService.uploadFile(file, "avatars");

            // Сохраняем путь в БД
            userService.updateUserAvatar(userService.getUserByUsername(user.getName()).getId(), fileName);

            redirectAttributes.addFlashAttribute("success", "Аватар успешно обновлен");

        } catch (Exception e) {
            log.error("Error uploading avatar: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", "Ошибка при загрузке файла: " + e.getMessage());
        }

        return "redirect:/cabinet/";
    }

    /**
     * Serves an avatar by redirecting to MinIO presigned URL.
     *
     * @param filename The name of the avatar file to serve.
     * @return A redirect to the MinIO presigned URL.
     */
    @GetMapping("/avatars/{filename:.+}")
    public String serveAvatar(@PathVariable String filename) {
        String url = minioService.getFileUrl("avatars/" + filename);
        return "redirect:" + url;
    }

    /**
     * Validates an avatar file.
     *
     * @param file The avatar file to validate.
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Файл не выбран");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("Размер файла не должен превышать 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException("Разрешены только файлы JPEG, PNG, GIF и WebP");
        }
    }
}