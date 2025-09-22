package com.bm.education.controllers;

import com.bm.education.models.DocumentationCategory;
import com.bm.education.services.DocumentationService;
import com.bm.education.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class DocumentationController {

    private final DocumentationService documentationService;
    private final UserService userService;

    @GetMapping("/docs")
    public String getDocsIndexPage(@RequestParam(name = "query", required = false) String query, Model model, Authentication auth) {
        List<DocumentationCategory> categories = documentationService.findAllCategories(query);
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("documentationCategories", categories);
        model.addAttribute("query", query);
        return "docs_index";
    }

    @GetMapping("/course/{course}/docs/category/{slug}")
    public String getDocumentationCategoryPage(@PathVariable String slug, @PathVariable String course, Model model, Authentication auth) {
        Optional<DocumentationCategory> categoryOptional = documentationService.findCategoryBySlugWithObjects(slug);

        if (categoryOptional.isPresent()) {
            model.addAttribute("user", userService.getUserByUsername(auth.getName()));
            model.addAttribute("category", categoryOptional.get());
            return "documentation_category";
        } else {
            return "404";
        }
    }
}