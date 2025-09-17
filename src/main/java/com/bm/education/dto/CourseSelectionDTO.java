package com.bm.education.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Data transfer object for a course selection.
 */
@Data
@AllArgsConstructor
public class CourseSelectionDTO {
    /**
     * The ID of the course.
     */
    private Integer id;
    /**
     * The title of the course.
     */
    private String title;
}