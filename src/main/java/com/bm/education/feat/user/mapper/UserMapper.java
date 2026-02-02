package com.bm.education.feat.user.mapper;

import com.bm.education.feat.user.dto.UserResponse;
import com.bm.education.feat.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRoles().isEmpty() ? \"\" : user.getRoles().iterator().next().getName())")
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toString())")
    UserResponse toResponse(User user);
}
