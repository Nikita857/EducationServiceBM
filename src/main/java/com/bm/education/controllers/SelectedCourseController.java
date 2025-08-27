package com.bm.education.controllers;

import com.bm.education.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class SelectedCourseController {
    private final ModuleService moduleService;
}
