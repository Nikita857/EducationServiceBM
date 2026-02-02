// offerModal.js - Merged functionality for handling offer responses.

let currentOffer = null;

// --- INITIALIZATION ---

// Initialize event listeners when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initOfferModal);

/**
 * Initializes all event listeners for the offer response modal.
 */
function initOfferModal() {
    const modalElement = document.getElementById('offerResponseModal');
    // The form ID is 'adminUpdateForm' from admin.ftlh.
    const responseForm = document.getElementById('adminUpdateForm');

    if (modalElement) {
        // Use event delegation for all buttons that open the response modal.
        document.body.addEventListener('click', handleOpenModalClick);
        // Clear the form when the modal is closed.
        modalElement.addEventListener('hidden.bs.modal', clearModalForm);
    }

    if (responseForm) {
        // Handle the form submission.
        responseForm.addEventListener('submit', handleSubmitResponse);
    }
}


// --- EVENT HANDLERS ---

/**
 * Handles clicks on the body to open the modal if the target is a response button.
 * @param {Event} event - The click event.
 */
function handleOpenModalClick(event) {
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
}

/**
 * Handles the submission of the offer response form.
 * @param {Event} event - The submit event.
 */
async function handleSubmitResponse(event) {
    event.preventDefault();

    const form = event.target;
    const offerId = form.querySelector('#offerId').value;
    const status = form.querySelector('#responseStatus').value;
    const responseText = form.querySelector('#responseText').value;

    const updateData = {
        offerId: offerId,
        status: status,
        response: responseText.trim()
    };

    const submitBtn = form.querySelector('button[type="submit"]');
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
            const errorMessage = result.errors
                ? 'Ошибки валидации:\n' + Object.values(result.errors).join('\n')
                : `Ошибка: ${result.message || 'Неизвестная ошибка'}`;
            showAlert(errorMessage, 'error');
            return;
        }

        showAlert('Заявка успешно обновлена!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('offerResponseModal'));
        modal.hide();

        // Refresh the offers list if the function exists.
        if (typeof loadOffers === 'function') {
            loadOffers();
        }

    } catch (error) {
        console.error('Error updating offer:', error);
        showAlert('Ошибка сервера', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}


// --- MODAL AND FORM LOGIC ---

/**
 * Opens the modal and populates it with the offer data.
 * @param {object} offerData - The data for the offer.
 */
function openOfferResponseModal(offerData) {
    currentOffer = offerData;
    populateModalForm(offerData);

    const modal = new bootstrap.Modal(document.getElementById('offerResponseModal'));
    modal.show();
}

/**
 * Fills the modal's form with data from the selected offer.
 * @param {object} offerData - The data for the offer.
 */
function populateModalForm(offerData) {
    document.getElementById('responseOfferId').textContent = offerData.id;
    document.getElementById('offerId').value = offerData.id;
    document.getElementById('responseDescription').textContent = offerData.description || 'Описание отсутствует';
    document.getElementById('responseStatus').value = offerData.status || 'PENDING';
    document.getElementById('responseText').value = offerData.response || '';
}

/**
 * Clears the form fields and resets the state.
 */
function clearModalForm() {
    const form = document.getElementById('adminUpdateForm');
    if (form) {
        form.reset(); // Resets all form fields
    }
    // Manually clear elements not part of the form if needed
    document.getElementById('responseOfferId').textContent = '';
    document.getElementById('responseDescription').textContent = 'Описание отсутствует';
    currentOffer = null;
}


// --- UTILITY FUNCTIONS ---

/**
 * Creates the HTML for the response button.
 * @param {object} offer - The offer object.
 * @returns {string} HTML string for the button.
 */
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

/**
 * Gets the CSRF token from the page's meta tags.
 * @returns {string} The CSRF token.
 */
function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} text - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"]|'(?!$)/g, m => map[m]);
}

// --- GLOBAL EXPOSURE ---

// Expose functions to the global scope if they need to be called from inline scripts or other modules.
window.openOfferResponseModal = openOfferResponseModal;
window.createOfferResponseButton = createOfferResponseButton;
