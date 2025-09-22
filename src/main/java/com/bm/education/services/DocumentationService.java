package com.bm.education.services;

import com.bm.education.models.DocumentationCategory;
import com.bm.education.repositories.DocumentationCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentationService {

    private final DocumentationCategoryRepository documentationCategoryRepository;

    public Optional<DocumentationCategory> findCategoryBySlugWithObjects(String slug) {
        return documentationCategoryRepository.findBySlugWithObjects(slug);
    }

    public List<DocumentationCategory> findAllCategories(String query) {
        if (query != null && !query.isBlank()) {
            return documentationCategoryRepository.findByNameContainingIgnoreCaseWithCourseData(query);
        }
        return documentationCategoryRepository.findAllWithCourseData();
    }
}
