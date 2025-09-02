// offerModal.js

// Текущая заявка
let currentOffer = null;

// Инициализация модального окна
function initOfferModal() {
    bindModalEvents();
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
    document.getElementById('offerId').textContent = offerData.id;
    document.getElementById('offerId').value = offerData.id;
    document.getElementById('responseDescription').textContent = offerData.description || 'Описание отсутствует';
    document.getElementById('responseStatus').value = offerData.status || 'PENDING';
    document.getElementById('responseText').value = offerData.response || '';
}

function createOfferResponseButton(offer) {
    return `
        <button class="btn btn-info btn-icon btn-sm" title="Ответить"
                onclick="openOfferResponseModal({
                    id: ${offer.id},
                    description: '${escapeHtml(offer.description || '')}',
                    response: '${escapeHtml(offer.response || '')}',
                    status: '${offer.status}'
                })">
            <i class="bi bi-reply"></i>
        </button>
    `;
}

// Функция экранирования HTML
function escapeHtml(text) {
    return text.replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', initOfferModal);