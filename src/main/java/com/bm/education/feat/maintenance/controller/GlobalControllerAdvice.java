package com.bm.education.feat.maintenance.controller;

import com.bm.education.feat.maintenance.service.ApplicationSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

    private final ApplicationSettingService settingService;

    @Value("${app.static.host:}")
    private String staticHost;

    @ModelAttribute("staticHost")
    public String getStaticHost() {
        return staticHost;
    }

    @ModelAttribute("isBannerEnabled")
    public boolean isBannerEnabled() {
        return "true".equalsIgnoreCase(settingService.getSetting(ApplicationSettingService.KEY_SITE_BANNER_ENABLED));
    }

    @ModelAttribute("bannerText")
    public String getBannerText() {
        return settingService.getSetting(ApplicationSettingService.KEY_SITE_BANNER_TEXT);
    }
}
