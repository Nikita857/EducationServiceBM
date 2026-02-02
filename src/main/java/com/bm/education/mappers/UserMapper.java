package com.bm.education.mappers;

import com.bm.education.dto.UserResponseDTO;
import com.bm.education.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRoles().isEmpty() ? \"\" : user.getRoles().iterator().next().getName())")
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toString())")
    UserResponseDTO toResponseDTO(User user);
}
