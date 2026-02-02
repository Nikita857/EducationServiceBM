package com.bm.education.mappers;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.dto.CourseWithProgressDTO;
import com.bm.education.models.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "status", expression = "java(course.getStatus().toString())")
    @Mapping(target = "createdAt", expression = "java(course.getCreatedAt().toString())")
    @Mapping(target = "updatedAt", expression = "java(course.getUpdatedAt().toString())")
    CourseResponseDTO toResponseDTO(Course course);

    @Mapping(target = "progress", source = "progress")
    CourseWithProgressDTO toWithProgressDTO(Course course, Long progress);
}
