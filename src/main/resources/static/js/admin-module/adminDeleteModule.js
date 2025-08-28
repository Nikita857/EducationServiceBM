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
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Ошибка при удалении модуля');
                });
            }
            return response.json();
        })
        .then(data => {
            // Успешное удаление
            alert(data.message || 'Модуль успешно удален');

            // Опционально: обновляем страницу или удаляем элемент из DOM
            location.reload(); // Перезагрузка страницы
            // Или: document.getElementById(`module-${id}`).remove();
        })
        .catch(error => {
            // Обработка ошибок
            alert(`Ошибка: ${error.message}`);
            console.error('Ошибка при удалении модуля:', error);
        });
}