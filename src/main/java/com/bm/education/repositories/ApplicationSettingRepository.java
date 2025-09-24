package com.bm.education.repositories;

import com.bm.education.models.ApplicationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationSettingRepository extends JpaRepository<ApplicationSetting, String> {
}
