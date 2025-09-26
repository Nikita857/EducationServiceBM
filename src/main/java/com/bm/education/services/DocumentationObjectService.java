package com.bm.education.services;

import com.bm.education.dto.DocumentationObjectCreateRequest;
import com.bm.education.dto.DocumentationObjectDTO;
import com.bm.education.models.DocumentationCategory;
import com.bm.education.models.DocumentationObject;
import com.bm.education.models.Tag;

import java.util.HashSet;
import java.util.Set;
import com.bm.education.repositories.DocumentationCategoryRepository;
import com.bm.education.repositories.DocumentationObjectRepository;
import com.bm.education.repositories.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentationObjectService {

    private final DocumentationObjectRepository documentationObjectRepository;
    private final DocumentationCategoryRepository documentationCategoryRepository;
    private final TagRepository tagRepository;

    @Value("${app.upload.path}")
    private String uploadPath;

    private Path getRootLocation() {
        return Paths.get(uploadPath, "docs");
    }

    @Transactional(readOnly = true)
    public Page<DocumentationObjectDTO> getDocuments(Pageable pageable, Integer courseId, Long categoryId) {
        Sort originalSort = pageable.getSort();
        Sort newSort = Sort.unsorted();

        for (Sort.Order order : originalSort) {
            String property = order.getProperty();
            // Remap DTO properties to Entity properties for sorting
            String mappedProperty = switch (property) {
                case "categoryName" -> "category.name";
                case "courseName" -> "category.documentation.course.title";
                default -> property; // Handles id, name, file, tags
            };
            newSort = newSort.and(Sort.by(order.getDirection(), mappedProperty));
        }

        Pageable newPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);

        Page<DocumentationObject> docPage = documentationObjectRepository.findByFilters(newPageable, courseId, categoryId);

        return docPage.map(this::convertToDocumentationObjectDTO);
    }

    private DocumentationObjectDTO convertToDocumentationObjectDTO(DocumentationObject doc) {
        String courseName = null;
        String categoryName = null;

        if (doc.getCategory() != null) {
            categoryName = doc.getCategory().getName();
            if (doc.getCategory().getDocumentation() != null && doc.getCategory().getDocumentation().getCourse() != null) {
                courseName = doc.getCategory().getDocumentation().getCourse().getTitle();
            }
        }

        String tagsString = doc.getTags().stream()
                .map(Tag::getName)
                .collect(java.util.stream.Collectors.joining(", "));

        return new DocumentationObjectDTO(
                doc.getId(),
                doc.getName(),
                tagsString,
                doc.getFile(),
                categoryName,
                courseName
        );
    }

    @Transactional
    public void deleteDocument(Long id) throws IOException {
        Optional<DocumentationObject> docOptional = documentationObjectRepository.findById(id);

        if (docOptional.isPresent()) {
            DocumentationObject doc = docOptional.get();

            // First, delete the file from the filesystem.
            String filename = doc.getFile();
            if (filename != null && !filename.isBlank()) {
                Path filePath = getRootLocation().resolve(filename).normalize().toAbsolutePath();
                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    log.error("Failed to delete file: {}", filePath, e);
                    // Re-throw the exception to ensure the transaction is rolled back.
                    throw e;
                }
            }

            // If file deletion was successful, delete the entity from the database.
            documentationObjectRepository.deleteById(id);
        }
    }

    @Transactional
    public DocumentationObject createDocument(@NotNull DocumentationObjectCreateRequest request) throws IOException {
        // Handle file upload
        String fileUrl = null;
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            fileUrl = saveFile(request.getFile());
        }

        // Fetch category
        DocumentationCategory category = documentationCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Категория с ID " + request.getCategoryId() + " не найдена"));

        // Create and save DocumentationObject
        DocumentationObject docObject = new DocumentationObject();
        docObject.setName(request.getName());
        docObject.setFile(fileUrl);
        docObject.setText(request.getTextContent());
        docObject.setCategory(category);

        // Handle Tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName.trim())
                        .orElseGet(() -> new Tag(tagName.trim()));
                tags.add(tag);
            }
            docObject.setTags(tags);
        }

        return documentationObjectRepository.save(docObject);
    }

    private @NotNull String saveFile(@NotNull MultipartFile file) throws IOException {
        Path rootLocation = getRootLocation();
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }
        }
        String filename = UUID.randomUUID() + fileExtension;

        Path destinationFile = rootLocation.resolve(Paths.get(filename))
                .normalize().toAbsolutePath();

        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }
}
