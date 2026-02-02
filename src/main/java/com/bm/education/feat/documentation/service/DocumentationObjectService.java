package com.bm.education.feat.documentation.service;

import com.bm.education.feat.documentation.dto.DocumentationObjectCreateRequest;
import com.bm.education.feat.documentation.dto.DocumentationObjectDTO;
import com.bm.education.feat.documentation.model.DocumentationCategory;
import com.bm.education.feat.documentation.model.DocumentationObject;
import com.bm.education.feat.documentation.model.Tag;
import com.bm.education.feat.documentation.repository.DocumentationCategoryRepository;
import com.bm.education.feat.documentation.repository.DocumentationObjectRepository;
import com.bm.education.feat.documentation.repository.TagRepository;
import com.bm.education.feat.documentation.mapper.DocumentationMapper;
import com.bm.education.feat.storage.service.MinioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentationObjectService {

    private final DocumentationObjectRepository documentationObjectRepository;
    private final DocumentationCategoryRepository documentationCategoryRepository;
    private final TagRepository tagRepository;
    private final DocumentationMapper documentationMapper;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public Page<DocumentationObjectDTO> getDocuments(Pageable pageable, Integer courseId, Long categoryId) {
        Sort originalSort = pageable.getSort();
        Sort newSort = Sort.unsorted();

        for (Sort.Order order : originalSort) {
            String property = order.getProperty();
            String mappedProperty = switch (property) {
                case "categoryName" -> "category.name";
                case "courseName" -> "category.documentation.course.title";
                default -> property;
            };
            newSort = newSort.and(Sort.by(order.getDirection(), mappedProperty));
        }

        Pageable newPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);
        Page<DocumentationObject> docPage = documentationObjectRepository.findByFilters(newPageable, courseId,
                categoryId);

        return docPage.map(documentationMapper::toDto);
    }

    @Transactional
    public void deleteDocument(Long id) throws IOException {
        Optional<DocumentationObject> docOptional = documentationObjectRepository.findById(id);

        if (docOptional.isPresent()) {
            DocumentationObject doc = docOptional.get();
            String filename = doc.getFile();
            if (filename != null && !filename.isBlank()) {
                minioService.deleteFile(filename);
            }
            documentationObjectRepository.deleteById(id);
        }
    }

    @Transactional
    public DocumentationObject createDocument(@NotNull DocumentationObjectCreateRequest request) throws IOException {
        String fileUrl = null;
        if (request.file() != null && !request.file().isEmpty()) {
            fileUrl = minioService.uploadFile(request.file(), "docs");
        }

        DocumentationCategory category = documentationCategoryRepository.findById(request.categoryId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Категория с ID " + request.categoryId() + " не найдена"));

        DocumentationObject docObject = new DocumentationObject();
        docObject.setName(request.name());
        docObject.setFile(fileUrl);
        docObject.setText(request.textContent());
        docObject.setCategory(category);

        if (request.tags() != null && !request.tags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.tags()) {
                Tag tag = tagRepository.findByName(tagName.trim())
                        .orElseGet(() -> new Tag(tagName.trim()));
                tags.add(tag);
            }
            docObject.setTags(tags);
        }

        return documentationObjectRepository.save(docObject);
    }
}
