package com.bm.education.feat.module.mapper;

import com.bm.education.feat.module.dto.ModuleResponse;
import com.bm.education.feat.module.model.Module;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ModuleMapper {
    @Mapping(target = "moduleId", source = "module.id")
    @Mapping(target = "courseName", source = "module.course.title")
    @Mapping(target = "moduleSlug", source = "module.slug")
    @Mapping(target = "moduleTitle", source = "module.title")
    @Mapping(target = "moduleStatus", expression = "java(module.getStatus().toString())")
    @Mapping(target = "lessonsCompleted", source = "lessonsCompleted")
    @Mapping(target = "testPassed", source = "testPassed")
    ModuleResponse toResponseDTO(Module module, boolean lessonsCompleted, boolean testPassed);
}
