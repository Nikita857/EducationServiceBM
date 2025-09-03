package com.bm.education.api;

import com.bm.education.dto.CreateLessonDTO;
import com.bm.education.dto.LessonUploadRequest;
import com.bm.education.models.Lesson;
import com.bm.education.services.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UploadLessonController {

    private static final String UPLOAD_DIR = Paths.get("src", "main", "resources", "static", "videos")
            .toAbsolutePath()
                    .normalize()
                        .toString();
    private final LessonService lessonService;

    @PostMapping(value = "/admin/lesson/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLesson(@Valid @ModelAttribute LessonUploadRequest request,
                                          BindingResult bindingResult) {

        if(lessonService.validation(bindingResult) != null) {
            return ResponseEntity.badRequest().body(lessonService.validation(bindingResult));
        }
        // Проверка на пустой файл
        if (request.getFile().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Файл не должен быть пустым"
            ));
        }

        try {
            MultipartFile file = request.getFile();

            // Создаем абсолютный путь к директории для сохранения
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

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

            // Проверяем что файл действительно сохранился
            if (Files.exists(filePath) && Files.size(filePath) > 0) {
                CreateLessonDTO dto = new CreateLessonDTO();
                dto.setTitle(request.getTitle());
                dto.setVideo(uniqueFileName);
                dto.setDescription(request.getDescription());
                dto.setShortDescription(request.getShortDescription());
                dto.setTestCode(request.getTestCode());
                dto.setModuleId(request.getModuleId());

                Lesson savedLesson = lessonService.saveLesson(dto);

                return ResponseEntity.ok().body(Map.of(
                        "success", true,
                        "message", "Урок успешно создан",
                        "lessonId", savedLesson.getId(),
                        "fileName", uniqueFileName
                ));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "success", false,
                        "message", "Видеофайл не был сохранен"
                ));
            }

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Ошибка сохранения файла: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Ошибка обработки запроса: " + e.getMessage()
            ));
        }
    }
}
