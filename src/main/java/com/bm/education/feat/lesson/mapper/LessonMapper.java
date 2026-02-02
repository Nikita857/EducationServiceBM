package com.bm.education.feat.lesson.mapper;

import com.bm.education.feat.lesson.dto.LessonListResponse;
import com.bm.education.feat.lesson.dto.LessonResponse;
import com.bm.education.feat.lesson.model.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "moduleName", source = "module.title")
    @Mapping(target = "moduleSlug", source = "module.slug")
    @Mapping(target = "courseSlug", source = "module.course.slug")
    LessonListResponse toListResponse(Lesson lesson);

    @Mapping(target = "moduleName", source = "module.title")
    LessonResponse toResponse(Lesson lesson);
}
