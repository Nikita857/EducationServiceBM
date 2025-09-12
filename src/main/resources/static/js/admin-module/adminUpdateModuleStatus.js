function adminUpdateModuleStatus(moduleID, status) {
    const isConfirmed = confirm('Вы уверены, что хотите обновить статус?');

    if (!isConfirmed) {
        return; // Если пользователь отменил, прерываем выполнение
    }

    if(status === 'ACTIVE') {
        status = 'INACTIVE'
    }else{
        status = 'ACTIVE'
    }

    // Отправляем запрос на сервер
    fetch(`/admin/modules/updateStatus/${moduleID}/${status}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || '' // Для Spring Security CSRF
        }
    })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw new Error(data.message || 'Ошибка при обновлении статуса');
                }
                return data;
            });
        })
        .then(data => {
            // Успешное обновление
            showAlert(data.message, 'success');

            // Обновляем таблицу модулей без перезагрузки страницы
            if (typeof loadModules === 'function') {
                void loadModules(window.currentModulesPage || 1);
            }
        })
        .catch(error => {
            // Обработка ошибок
            showAlert(`Ошибка: ${error.message}`, 'error');
            console.error('Ошибка при обновлении статуса:', error);
        });
}

window.adminUpdateModuleStatus = adminUpdateModuleStatus;
