package com.bm.education.mappers;

import com.bm.education.dto.DocumentationCategoryDTO;
import com.bm.education.dto.DocumentationObjectDTO;
import com.bm.education.dto.DocumentationObjectResponseDTO;
import com.bm.education.models.DocumentationCategory;
import com.bm.education.models.DocumentationObject;

import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentationMapper {

    DocumentationCategoryDTO toCategoryDto(DocumentationCategory category);

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "courseName", source = "category.documentation.course.title")
    @Mapping(target = "tags", expression = "java(mapTags(object.getTags()))")
    DocumentationObjectDTO toDto(DocumentationObject object);

    @Mapping(target = "categoryId", source = "category.id")
    DocumentationObjectResponseDTO toResponseDto(DocumentationObject object);

    default String mapTags(java.util.Set<com.bm.education.models.Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        return tags.stream()
                .map(com.bm.education.models.Tag::getName)
                .collect(Collectors.joining(", "));
    }
}
