package com.bm.education.feat.documentation.mapper;

import com.bm.education.feat.documentation.dto.DocumentationCategoryDTO;
import com.bm.education.feat.documentation.dto.DocumentationObjectDTO;
import com.bm.education.feat.documentation.dto.DocumentationObjectResponseDTO;
import com.bm.education.feat.documentation.model.DocumentationCategory;
import com.bm.education.feat.documentation.model.DocumentationObject;

import java.util.stream.Collectors;

import com.bm.education.feat.documentation.model.Tag;
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

    default String mapTags(java.util.Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        return tags.stream()
                .map(Tag::getName)
                .collect(Collectors.joining(", "));
    }
}
