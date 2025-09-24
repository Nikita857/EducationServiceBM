package com.bm.education.controllers;

import com.bm.education.services.ApplicationSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

    private final ApplicationSettingService settingService;

    @ModelAttribute("isBannerEnabled")
    public boolean isBannerEnabled() {
        return "true".equalsIgnoreCase(settingService.getSetting(ApplicationSettingService.KEY_SITE_BANNER_ENABLED));
    }

    @ModelAttribute("bannerText")
    public String getBannerText() {
        return settingService.getSetting(ApplicationSettingService.KEY_SITE_BANNER_TEXT);
    }
}
