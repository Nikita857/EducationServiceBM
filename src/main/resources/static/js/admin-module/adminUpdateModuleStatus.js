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
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            // Успешное удаление
            showAlert(data.message, 'success');

            // Опционально: обновляем страницу или удаляем элемент из DOM
            location.reload(); // Перезагрузка страницы
            // Или: document.getElementById(`module-${id}`).remove();
        })
        .catch(error => {
            // Обработка ошибок
            showAlert(`Ошибка: ${error.message}`, 'error');
            console.error('Ошибка при обновлении статуса:', error);
        });
}

window.adminUpdateModuleStatus = adminUpdateModuleStatus;
