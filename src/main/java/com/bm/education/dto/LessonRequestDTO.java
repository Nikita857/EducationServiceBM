package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a lesson request.
 */
@Data
public class LessonRequestDTO {
    /**
     * The ID of the lesson.
     */
    Integer id;
    /**
     * The title of the lesson.
     */
    String title;
    /**
     * The name of the module the lesson belongs to.
     */
    String moduleName;
    /**
     * The slug of the module the lesson belongs to.
     */
    String moduleSlug;
    /**
     * The slug of the course the lesson belongs to.
     */
    String courseSlug;
}