package com.bm.education.feat.course.mapper;

import com.bm.education.feat.course.dto.CategoryResponse;
import com.bm.education.feat.course.dto.CourseResponse;
import com.bm.education.feat.course.dto.CourseWithProgress;
import com.bm.education.feat.course.model.Category;
import com.bm.education.feat.course.model.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "status", expression = "java(course.getStatus().toString())")
    @Mapping(target = "createdAt", expression = "java(course.getCreatedAt().toString())")
    @Mapping(target = "updatedAt", expression = "java(course.getUpdatedAt().toString())")
    @Mapping(target = "category", source = "category")
    CourseResponse toResponseDTO(Course course);

    CategoryResponse toCategoryDTO(Category category);

    @Mapping(target = "progress", source = "progress")
    CourseWithProgress toCourseWithProgress(Course course, Long progress);
}
