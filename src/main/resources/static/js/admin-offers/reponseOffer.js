// offerModal.js

// Текущая заявка
let currentOffer = null;

// Инициализация модального окна
function initOfferModal() {
    bindModalEvents();

    // Используем делегирование событий для всех кнопок ответа
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.js-open-response-modal');
        if (button) {
            const offerData = {
                id: button.dataset.id,
                description: button.dataset.description,
                response: button.dataset.response,
                status: button.dataset.status
            };
            openOfferResponseModal(offerData);
        }
    });
}

// Привязка событий
function bindModalEvents() {
    const submitBtn = document.getElementById('submitResponseBtn');
    const modal = document.getElementById('offerResponseModal');

    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmitResponse);
    }

    if (modal) {
        modal.addEventListener('hidden.bs.modal', clearModalForm);
    }
}

// Открытие модального окна
function openOfferResponseModal(offerData) {
    currentOffer = offerData;
    populateModalForm(offerData);

    const modal = new bootstrap.Modal(document.getElementById('offerResponseModal'));
    modal.show();
}

// Заполнение формы данными
function populateModalForm(offerData) {
    document.getElementById('responseOfferId').textContent = offerData.id;
    document.getElementById('offerId').value = offerData.id;
    document.getElementById('responseDescription').textContent = offerData.description || 'Описание отсутствует';
    document.getElementById('responseStatus').value = offerData.status || 'PENDING';
    document.getElementById('responseText').value = offerData.response || '';
}

function createOfferResponseButton(offer) {
    return `
        <button class="btn btn-info btn-icon btn-sm js-open-response-modal" 
                title="Ответить"
                data-id="${offer.id}"
                data-description="${escapeHtml(offer.description || '')}"
                data-response="${escapeHtml(offer.response || '')}"
                data-status="${offer.status}">
            <i class="bi bi-reply"></i>
        </button>
    `;
}

// Функция экранирования HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', initOfferModal);

// --- ADDED MISSING FUNCTIONS ---

function clearModalForm() {
    document.getElementById('responseDescription').textContent = 'Описание отсутствует';
    document.getElementById('responseStatus').value = 'PENDING';
    document.getElementById('responseText').value = '';
}

async function handleSubmitResponse(event) {
    event.preventDefault();
    const offerId = document.getElementById('offerId').value;
    const status = document.getElementById('responseStatus').value;
    const responseText = document.getElementById('responseText').value;

    const updateData = {
        offerId: offerId,
        status: status,
        response: responseText.trim()
    };

    const submitBtn = event.target;
    const originalText = submitBtn.innerHTML;

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Обновление...';

        const response = await fetch('/admin/updateOffer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                const errorMessages = Object.values(result.errors).join('\n');
                alert(`Ошибки валидации:\n${errorMessages}`);
            } else {
                alert(`Ошибка: ${result.message || 'Неизвестная ошибка'}`);
            }
            return;
        }

        alert('Заявка успешно обновлена!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('offerResponseModal'));
        modal.hide();

        if (typeof loadOffers === 'function') {
            loadOffers();
        }

    } catch (error) {
        console.error('Error updating offer:', error);
        alert('Произошла сетевая ошибка');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}


// --- EXPOSE FUNCTIONS ---
window.openOfferResponseModal = openOfferResponseModal;
window.createOfferResponseButton = createOfferResponseButton;