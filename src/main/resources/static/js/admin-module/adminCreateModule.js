document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createModuleForm');
    const courseSelect = document.getElementById('moduleCourseId');
    const titleInput = document.getElementById('moduleTitle');
    const slugInput = document.getElementById('moduleSlug');


    const courseSelectAdminCreateModule = document.getElementById('moduleCourseId');
    void loadCoursesIntoSelect(courseSelectAdminCreateModule, null)

    // Load courses when the tab is shown
    const createModuleTab = document.querySelector('a[data-tab="create-module-tab"]');
    if (createModuleTab) {
        createModuleTab.addEventListener('click', loadCourses);
    }
    
    // Also load courses if the tab is already active on page load
    if (document.getElementById('create-module-tab')?.classList.contains('active')) {
        void loadCourses();
    }


    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (!validateForm()) {
                return;
            }

            try {
                const formData = {
                    courseId: courseSelect.value,
                    slug: slugInput.value,
                    title: titleInput.value,
                };

                const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
                const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

                const headers = {
                    'Content-Type': 'application/json'
                };
                if (csrfToken && csrfHeader) {
                    headers[csrfHeader] = csrfToken;
                }


                const response = await fetch('/admin/modules/create', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    showAlert(result.message || 'Модуль успешно создан!', 'success');
                    form.reset();
                    // Optionally, switch back to the modules list tab
                    const modulesTab = document.querySelector('a[data-tab="modules-edit-tab"]');
                    if (modulesTab) {
                        modulesTab.click();
                    }
                } else {
                    if (result.errors) {
                        const errorMessages = Object.values(result.errors).join('\n');
                        showAlert('Ошибка валидации:\n' + errorMessages, 'error');
                    } else {
                        showAlert(result.message || "Ошибка при создании модуля", 'error');
                    }
                    console.error('Server error:', result.message || result.errors);
                }

            } catch (error) {
                console.error('Ошибка отправки:', error);
                showAlert('Произошла критическая ошибка при отправке данных', 'error');
            }
        });
    }

    function validateForm() {
        if (!courseSelect.value) {
            showAlert('Пожалуйста, выберите курс', 'error');
            return false;
        }
        if (!titleInput.value.trim()) {
            showAlert('Пожалуйста, введите название модуля', 'error');
            return false;
        }
        if (!slugInput.value.trim()) {
            showAlert('Пожалуйста, укажите URI модуля', 'error');
            return false;
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slugInput.value)) {
            showAlert('URI может содержать только латинские буквы в нижнем регистре, цифры и дефисы', 'error');
            return false;
        }
        return true;
    }

    let isSlugManuallyEdited = false;

    if (titleInput && slugInput) {
        // Generate slug as user types in the title field
        titleInput.addEventListener('input', () => {
            if (!isSlugManuallyEdited) {
                generateSlugFromTitle();
            }
        });

        // Detect when user edits the slug field manually to disable auto-generation
        slugInput.addEventListener('input', () => {
            isSlugManuallyEdited = true;
        });
    }

    function generateSlugFromTitle() {
        const title = titleInput.value.trim();
        if (title) {
            const translitMap = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
                'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
                'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
                'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
            };

            let slug = title.toLowerCase();
            let result = '';
            for (let i = 0; i < slug.length; i++) {
                result += translitMap[slug[i]] || slug[i];
            }

            slug = result
                .replace(/['"’]/g, '')      // remove quotes
                .replace(/\s+/g, '-')       // collapse whitespace and replace by -
                .replace(/[^a-z0-9-]/g, '') // remove invalid chars
                .replace(/-+/g, '-')        // collapse dashes
                .replace(/^-|-$/g, '');     // trim - from start or end

            slugInput.value = slug;
        }
    }
});