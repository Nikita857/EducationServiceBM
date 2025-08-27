// Глобальная переменная для хранения ID заявки
let currentOfferId = null;

// Функция для открытия модального окна
function openOfferUpdateModal(offerId, currentStatus = null, currentResponse = null) {
    currentOfferId = offerId;

    // Заполняем скрытое поле ID
    document.getElementById('offerId').value = offerId;

    // Устанавливаем текущие значения если переданы
    if (currentStatus) {
        document.querySelector('select[name="status"]').value = currentStatus;
    }

    if (currentResponse) {
        document.querySelector('textarea[name="response"]').value = currentResponse;
    }

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('offerResponseModal'));
    modal.show();
}

// Обработчик отправки формы
async function submitOfferUpdate(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const updateData = {
        offerId: formData.get('id'),
        status: formData.get('status'),
        response: formData.get('response').trim()
    };

    console.log(updateData)

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
        // Блокируем кнопку на время отправки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Обновление...';


        const response = await fetch('admin/updateOffer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Обработка ошибок валидации
            if (result.errors) {
                const errorMessages = Object.values(result.errors).join('\n');
                alert(`Ошибки валидации:\n${errorMessages}`);
            } else {
                alert(`Ошибка: ${result.message || 'Неизвестная ошибка'}`);
            }
            return;
        }

        // Успех
        alert('Заявка успешно обновлена!');

        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('offerResponseModal'));
        modal.hide();

        // Обновляем таблицу заявок (если функция существует)
        if (typeof refreshOffersTable === 'function') {
            refreshOffersTable();
        }

        // Очищаем форму
        form.reset();

    } catch (error) {
        console.error('Error updating offer:', error);
        alert('Произошла сетевая ошибка');
    } finally {
        // Разблокируем кнопку
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Привязка обработчика формы
    const updateForm = document.getElementById('adminUpdateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', submitOfferUpdate);
    }

    // Обработчики для всех кнопок обновления
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-update-offer') ||
            e.target.closest('.btn-update-offer')) {

            const button = e.target.classList.contains('btn-update-offer') ?
                e.target : e.target.closest('.btn-update-offer');

            const offerId = button.getAttribute('data-offer-id');
            const currentStatus = button.getAttribute('data-current-status');
            const currentResponse = button.getAttribute('data-current-response');

            if (offerId) {
                openOfferUpdateModal(
                    parseInt(offerId),
                    currentStatus,
                    currentResponse
                );
            }
        }
    });

    // Сброс формы при закрытии модального окна
    const modalElement = document.getElementById('offerResponseModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function() {
            const form = document.getElementById('adminUpdateForm');
            if (form) {
                form.reset();
            }
            currentOfferId = null;
        });
    }
});