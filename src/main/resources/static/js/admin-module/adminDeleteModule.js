function deleteModule(id) {
    // Показываем подтверждающее окно
    const isConfirmed = confirm('Вы уверены, что хотите удалить этот модуль, и все его уроки? Это действие нельзя отменить.');

    if (!isConfirmed) {
        return; // Если пользователь отменил, прерываем выполнение
    }

    // Отправляем запрос на сервер
    fetch(`/admin/module/${id}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || '' // Для Spring Security CSRF
        }
    })
        .then(response => {
            // Всегда пытаемся парсить JSON, даже для "плохих" ответов
            return response.json().then(data => {
                if (!response.ok) {
                    // Если ответ не "ok", создаем ошибку с сообщением от сервера
                    throw new Error(data.message || 'Ошибка при удалении модуля');
                }
                return data; // Возвращаем данные, если все в порядке
            });
        })
        .then(data => {
            // Успешное удаление
            showAlert(data.message || 'Модуль успешно удален', 'success');

            // Обновляем таблицу модулей без перезагрузки страницы
            if (typeof loadModules === 'function') {
                void loadModules(window.currentModulesPage || 1);
            }
        })
        .catch(error => {
            // Обработка ошибок
            showAlert(`Ошибка: ${error.message}`, 'error');
            console.error('Ошибка при удалении модуля:', error);
        });
}

window.deleteModule = deleteModule;
