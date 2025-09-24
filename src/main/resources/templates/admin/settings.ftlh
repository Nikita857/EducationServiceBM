<#-- Settings Page for Admin Panel -->
<#import "/spring.ftl" as spring>
<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>Настройки</title>
    <style>
        .form-check-input:checked {
            background-color: #6366f1;
            border-color: #6366f1;
        }
    </style>
</head>
<body>
<div class="container-fluid p-4">
    <h2 class="section-title">Настройки приложения</h2>

    <div class="card bg-dark border-secondary mt-4">
        <div class="card-body">
            <form action="/admin/settings/save" method="post">
                
                <#-- Maintenance Mode -->
                <div class="mb-4 p-3 border border-secondary rounded">
                    <h5 class="mb-3">Режим обслуживания</h5>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="maintenanceModeSwitch"
                               name="${KEY_MAINTENANCE_MODE}" value="true"
                               <#if (settings[KEY_MAINTENANCE_MODE]?? && settings[KEY_MAINTENANCE_MODE] == 'true')>checked</#if>>
                        <label class="form-check-label" for="maintenanceModeSwitch">Включить режим обслуживания</label>
                    </div>
                    <div class="mt-3">
                        <label for="maintenanceEndTime" class="form-label">Время окончания обслуживания</label>
                        <input type="datetime-local" class="form-control" id="maintenanceEndTime"
                               name="${KEY_MAINTENANCE_END_TIME}"
                               value="<#if settings[KEY_MAINTENANCE_END_TIME]??>${settings[KEY_MAINTENANCE_END_TIME]}</#if>">
                    </div>
                    <small class="form-text text-muted">
                        Когда включено, сайт будет доступен только администраторам. Остальные увидят страницу "Сайт на обслуживании".
                    </small>
                </div>

                <#-- Registration Toggle -->
                <div class="mb-4 p-3 border border-secondary rounded">
                    <h5 class="mb-3">Регистрация пользователей</h5>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="registrationSwitch"
                               name="${KEY_REGISTRATION_ENABLED}" value="true"
                               <#if (settings[KEY_REGISTRATION_ENABLED]?? && settings[KEY_REGISTRATION_ENABLED] == 'true') || !settings[KEY_REGISTRATION_ENABLED]??>checked</#if>>
                        <label class="form-check-label" for="registrationSwitch">Разрешить публичную регистрацию</label>
                    </div>
                    <small class="form-text text-muted">
                        Если отключить, новые пользователи не смогут зарегистрироваться на сайте.
                    </small>
                </div>

                <#-- Site Banner -->
                <div class="p-3 border border-secondary rounded">
                    <h5 class="mb-3">Общесайтовый баннер</h5>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" role="switch" id="bannerSwitch"
                               name="${KEY_SITE_BANNER_ENABLED}" value="true"
                               <#if (settings[KEY_SITE_BANNER_ENABLED]?? && settings[KEY_SITE_BANNER_ENABLED] == 'true')>checked</#if>>
                        <label class="form-check-label" for="bannerSwitch">Включить баннер</label>
                    </div>
                    <div class="mb-3">
                        <label for="bannerText" class="form-label">Текст баннера</label>
                        <textarea class="form-control" id="bannerText" name="${KEY_SITE_BANNER_TEXT}" rows="3"><#if settings[KEY_SITE_BANNER_TEXT]??>${settings[KEY_SITE_BANNER_TEXT]}</#if></textarea>
                    </div>
                    <small class="form-text text-muted">
                        Баннер будет показан вверху каждой страницы, если он включен и содержит текст.
                    </small>
                </div>

                <div class="d-flex justify-content-end mt-4">
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-save me-2"></i>Сохранить настройки
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
