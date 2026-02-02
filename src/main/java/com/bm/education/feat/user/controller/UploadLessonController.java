package com.bm.education.feat.user.controller;

import com.bm.education.feat.lesson.dto.CreateLessonDTO;
import com.bm.education.feat.lesson.dto.LessonUploadRequest;
import com.bm.education.feat.lesson.model.Lesson;
import com.bm.education.feat.lesson.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

/**
 * Controller for handling lesson upload requests.
 */
@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UploadLessonController {

    @Value("${app.upload.path}")
    private String uploadPath;

    private final LessonService lessonService;

    /**
     * Creates a new lesson.
     *
     * @param request       The request object containing the lesson details.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the lesson was created
     *         successfully.
     */
    @PostMapping(value = "/admin/lesson/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLesson(@Valid @ModelAttribute LessonUploadRequest request,
            BindingResult bindingResult) {

        if (lessonService.validation(bindingResult) != null) {
            return ResponseEntity.badRequest().body(lessonService.validation(bindingResult));
        }
        // Проверка на пустой файл
        if (request.file().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Файл не должен быть пустым"));
        }

        try {
            MultipartFile file = request.file();

            // Создаем абсолютный путь к директории для сохранения
            Path uploadPath = Paths.get(this.uploadPath, "videos").toAbsolutePath().normalize();

            // Создаем директорию если не существует
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Генерируем уникальное имя файла
            String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID() + fileExtension;

            // Сохраняем файл
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.write(filePath, file.getBytes());

            /*
             * Гемини ебанулся и начал весь сайт ломать,
             * надо будет проверить всю ебаторию что он натворил, если что скачать с гита
             * проект и добавить отсюда механизм редактирования курсов
             */

            // Проверяем что файл действительно сохранился
            if (Files.exists(filePath) && Files.size(filePath) > 0) {
                CreateLessonDTO dto = new CreateLessonDTO(
                        request.title(),
                        uniqueFileName,
                        request.description(),
                        request.shortDescription(),
                        null,
                        request.moduleId(),
                        file.getSize());

                Lesson savedLesson = lessonService.saveLesson(dto);

                return ResponseEntity.ok().body(Map.of(
                        "success", true,
                        "message", "Урок успешно создан",
                        "lessonId", savedLesson.getId(),
                        "fileName", uniqueFileName));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "success", false,
                        "message", "Видеофайл не был сохранен"));
            }

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Ошибка сохранения файла: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Ошибка обработки запроса: " + e.getMessage()));
        }
    }
}