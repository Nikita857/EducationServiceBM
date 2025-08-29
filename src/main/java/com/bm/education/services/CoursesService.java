package com.bm.education.services;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.models.Course;
import com.bm.education.models.CourseStatus;
import com.bm.education.models.Role;
import com.bm.education.repositories.CoursesRepository;

import com.bm.education.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoursesService {

    private final CoursesRepository coursesRepository;
    private final UserRepository userRepository;
    private final Path rootLocation = Paths.get("src/main/resources/static/img/course-brand");

    public List<Course> getAllCourses() {return coursesRepository.findAll();}
    public Course getSelectedCourseBySlug(String slug) {
        if (!slug.isEmpty()) {
            return coursesRepository.findBySlugAndStatus(slug, CourseStatus.ACTIVE);
        }
        return null;
    }
    public Optional<Course> getSelectedCourseById(int id) {
        return coursesRepository.findById(id);
    }

    public List<Course> getUserCourses(Integer userId) {
        if(userRepository.findById(userId).isPresent()) {
            if(userRepository.findById(userId).get().getRoles().contains(Role.ROLE_ADMIN)) {
                log.info("Права пользователя определены как Администратор");
                return coursesRepository.findAll();
            }
            log.info("Права пользователя определы как ROLE_USER");
            return coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
        }else{
            return null;
        }
    }
    public Course createCourse(Course course, MultipartFile imageFile) throws IOException {
        // Проверяем уникальность slug
        if (coursesRepository.existsBySlug(course.getSlug())) {
            throw new IllegalArgumentException("Курс с таким URL уже существует");
        }

        // Обрабатываем изображение, если оно есть
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            course.setImage(imageUrl);
        }

        return coursesRepository.save(course);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Создаем директорию, если не существует
        log.info("Курс сервис создание директории при ее отсутствии");
        if (!Files.exists(rootLocation)) {
            log.info("Директории нет -> создаем");
            Files.createDirectories(rootLocation);
        }

        // Генерируем уникальное имя файла
        log.info("генерации имени файла");
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID() + fileExtension;
        log.info("Уникальное имя файла "+filename);

        // Сохраняем файл
        log.info("Сохранение файла");
        Path destinationFile = rootLocation.resolve(Paths.get(filename))
                .normalize().toAbsolutePath();
        log.info("Маршрут сохранения "+destinationFile);

        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        log.info("Файл сохранен");
        return filename;
    }

    private CourseResponseDTO convertToCourseResponseDto(Course course) {
        return new CourseResponseDTO(
                course.getId(),
                course.getTitle(),
                course.getImage(),
                course.getDescription(),
                course.getSlug(),
                course.getStatus().toString(),
                course.getCreatedAt().toString(),
                course.getUpdatedAt().toString()
        );
    }

    public Page<CourseResponseDTO> getCoursesForDTO(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Course> courses = coursesRepository.findAll(pageable);
        return courses.map(this::convertToCourseResponseDto);
    }
}
