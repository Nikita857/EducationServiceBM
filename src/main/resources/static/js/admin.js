// Original content of admin.js
async function getOfferDescription(offerId) {
    try {
        const response = await fetch(`/admin/offers/${offerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const offerData = await response.json();

        console.log(offerData)
        populateModal(offerData);

    } catch (error) {
        console.error('Ошибка при получении данных заявки:', error);
        alert('Не удалось загрузить данные заявки');
    }
}

// Заполнение модального окна данными
function populateModal(offerData) {
    $('#offerTitle').text(`Просмотр информации по заявке ${offerData.userId}`);
    $('#offerTopic').text(offerData.topic);
    $('#offerDescriptionBody').text(offerData.description)

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('offerContentModal'));
    modal.show();
}

// Обработчик события для закрытия модального окна
document.getElementById('offerContentModal').addEventListener('hidden.bs.modal', function () {
    // Очищаем поля при закрытии
    document.getElementById('modalUserId').textContent = '';
    document.getElementById('modalTopic').textContent = '';
    document.getElementById('modalDescription').textContent = '';
});
function switchToView(viewType) {
    $('.view-content').addClass('d-none')
    $(`.${viewType}`).removeClass('d-none')
}

window.getOfferDescription = getOfferDescription;
window.switchToView = switchToView;