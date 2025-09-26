package com.bm.education.controllers;

import com.bm.education.models.DocumentationCategory;
import com.bm.education.models.DocumentationObject;
import com.bm.education.models.Tag;
import com.bm.education.models.User;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
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
        User user = userService.getUserByUsername(auth.getName());
        List<DocumentationCategory> categories = documentationService.findAllCategories(query);
        model.addAttribute("user", user);
        model.addAttribute("documentationCategories", categories);
        model.addAttribute("query", query);
        model.addAttribute("isAdmin", userService.isAdmin(user));
        return "docs_index";
    }

    @GetMapping("/course/{course}/docs/category/{slug}")
    public String getDocumentationCategoryPage(@PathVariable String slug,
                                               @RequestParam(required = false) String tag, Model model, Authentication auth) {
        Optional<DocumentationCategory> categoryOptional = documentationService.findCategoryBySlugWithObjects(slug);
        User user = userService.getUserByUsername(auth.getName());

        if (categoryOptional.isPresent()) {
            DocumentationCategory category = categoryOptional.get();

            // Collect all unique tags from the original, unfiltered list of objects
            Set<Tag> uniqueTags = category.getDocumentationObjects().stream()
                    .flatMap(doc -> doc.getTags().stream())
                    .collect(Collectors.toSet());

            // If a tag filter is applied, replace the objects in the category with the filtered list
            if (tag != null && !tag.isBlank()) {
                List<DocumentationObject> filteredObjects = documentationService.findObjectsByCategorySlugAndTag(slug, tag);
                category.setDocumentationObjects(new HashSet<>(filteredObjects));
            }

            model.addAttribute("user", user);
            model.addAttribute("category", category);
            model.addAttribute("isAdmin", userService.isAdmin(user));
            model.addAttribute("uniqueTags", uniqueTags); // Pass unique tags to the view
            model.addAttribute("activeTag", tag); // Pass the currently active tag
            return "documentation_category";
        } else {
            return "error/404";
        }
    }
}