package com.bm.education.controllers;

import org.springframework.web.bind.annotation.GetMapping;

public class AdminAddModuleController {
    @GetMapping("/admin/modules/create")
    public String addModule() {
        return "addModule";
    }
}
