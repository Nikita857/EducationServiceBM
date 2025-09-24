package com.bm.education.services;

import com.bm.education.models.ApplicationSetting;
import com.bm.education.repositories.ApplicationSettingRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationSettingService {

    public static final String KEY_MAINTENANCE_MODE = "MAINTENANCE_MODE";
    public static final String KEY_REGISTRATION_ENABLED = "REGISTRATION_ENABLED";
    public static final String KEY_SITE_BANNER_TEXT = "SITE_BANNER_TEXT";
    public static final String KEY_SITE_BANNER_ENABLED = "SITE_BANNER_ENABLED";
    public static final String KEY_MAINTENANCE_END_TIME = "MAINTENANCE_END_TIME";

    private final ApplicationSettingRepository settingRepository;

    @Cacheable(value = "settings", key = "#key", unless = "#result == null")
    public String getSetting(String key) {
        return settingRepository.findById(key).map(ApplicationSetting::getSettingValue).orElse(null);
    }

    @CacheEvict(value = "settings", key = "#key")
    public void saveSetting(String key, String value) {
        ApplicationSetting setting = new ApplicationSetting(key, value);
        settingRepository.save(setting);
    }

    public Map<String, String> getAllSettings() {
        return settingRepository.findAll().stream()
                .collect(Collectors.toMap(ApplicationSetting::getSettingKey, ApplicationSetting::getSettingValue));
    }

    @CacheEvict(value = "settings", allEntries = true)
    public void saveAllSettings(@NotNull Map<String, String> settings) {
        settings.forEach((key, value) -> {
            ApplicationSetting setting = new ApplicationSetting(key, value);
            settingRepository.save(setting);
        });
    }

    public boolean isMaintenanceModeEnabled() {
        return "true".equalsIgnoreCase(getSetting(KEY_MAINTENANCE_MODE));
    }

    public boolean isRegistrationEnabled() {
        // Default to true if setting is not present
        String value = getSetting(KEY_REGISTRATION_ENABLED);
        return value == null || "true".equalsIgnoreCase(value);
    }
}
