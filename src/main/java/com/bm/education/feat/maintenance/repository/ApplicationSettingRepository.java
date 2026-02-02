package com.bm.education.feat.maintenance.repository;

import com.bm.education.feat.maintenance.model.ApplicationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationSettingRepository extends JpaRepository<ApplicationSetting, String> {
}
