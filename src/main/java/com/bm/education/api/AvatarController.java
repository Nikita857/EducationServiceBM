package com.bm.education.api;

import com.bm.education.services.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AvatarController {

    private final UserService userService;

    private final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif", "image/webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private Path staticAvatarsPath;

    @PostConstruct
    public void init() {
        try {
            // Путь к папке static внутри resources
            staticAvatarsPath = Paths.get("src", "main", "resources", "static", "avatars")
                    .toAbsolutePath()
                    .normalize();

            // Создаем директорию если не существует
            if (!Files.exists(staticAvatarsPath)) {
                Files.createDirectories(staticAvatarsPath);
                log.info("Создана директория для аватаров: {}", staticAvatarsPath);
            }

            log.info("Директория аватаров: {}", staticAvatarsPath);

        } catch (IOException e) {
            log.error("Ошибка при создании директории: {}", e.getMessage());
            throw new RuntimeException("Не удалось создать директорию для аватаров", e);
        }
    }

    @PostMapping("/profile/avatar/upload")
    public String uploadAvatar(Authentication user,
                               @RequestParam("avatar") MultipartFile file,
                               RedirectAttributes redirectAttributes) {

        try {
            // Валидация файла
            validateFile(file);

            // Генерируем уникальное имя файла
            String originalFileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String fileName = UUID.randomUUID() + fileExtension;

            Files.deleteIfExists(staticAvatarsPath.resolve(userService.getUserByUsername(user.getName()).getAvatar().toString()));

            // Сохраняем файл в static/avatars/
            Path filePath = staticAvatarsPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Сохраняем путь в БД (только имя файла)
            userService.updateUserAvatar(userService.getUserByUsername(user.getName()).getId(), fileName);

            log.info("Аватар сохранен: {}", filePath);
            redirectAttributes.addFlashAttribute("success", "Аватар успешно обновлен");

        } catch (IOException e) {
            log.error("Ошибка при загрузке файла: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", "Ошибка при загрузке файла");
        } catch (Exception e) {
            log.error("Ошибка: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/cabinet/";
    }

    // Endpoint для получения аватара (если нужен программный доступ)
    @GetMapping("/avatars/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        try {
            Path file = staticAvatarsPath.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Валидация файла
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

    // Получение расширения файла
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    // Определение content type
    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        }
        return "application/octet-stream";
    }
}