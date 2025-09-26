package com.bm.education.services;

import com.bm.education.models.DocumentationCategory;
import com.bm.education.models.DocumentationObject;
import com.bm.education.repositories.DocumentationCategoryRepository;
import com.bm.education.repositories.DocumentationObjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentationService {

    private final DocumentationCategoryRepository documentationCategoryRepository;
    private final DocumentationObjectRepository documentationObjectRepository;

    public Optional<DocumentationCategory> findCategoryBySlugWithObjects(String slug) {
        return documentationCategoryRepository.findBySlugWithObjects(slug);
    }

    public List<DocumentationObject> findObjectsByCategorySlugAndTag(String slug, String tagName) {
        return documentationObjectRepository.findByCategorySlugAndTagName(slug, tagName);
    }

    public List<DocumentationCategory> findAllCategories(String query) {
        if (query != null && !query.isBlank()) {
            return documentationCategoryRepository.findByNameContainingIgnoreCaseWithCourseData(query);
        }
        return documentationCategoryRepository.findAllWithCourseData();
    }
}
