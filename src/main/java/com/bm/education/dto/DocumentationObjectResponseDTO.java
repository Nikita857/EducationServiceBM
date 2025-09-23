package com.bm.education.dto;

import com.bm.education.models.DocumentationObject;
import lombok.Data;

@Data
public class DocumentationObjectResponseDTO {
    private Long id;
    private String name;
    private String file;
    private Long categoryId;

    public DocumentationObjectResponseDTO(DocumentationObject doc) {
        this.id = doc.getId();
        this.name = doc.getName();
        this.file = doc.getFile();
        if (doc.getCategory() != null) {
            this.categoryId = doc.getCategory().getId();
        }
    }
}
