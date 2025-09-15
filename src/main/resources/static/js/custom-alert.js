function showAlert(message, status = 'info', duration = 3000) {
    const container = document.getElementById('custom-alert-container');
    if (!container) {
        console.error('custom-alert-container not found');
        return;
    }

    const alertId = `alert-${Date.now()}`;
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.className = `custom-alert alert-${status}`;
    alertDiv.role = 'alert';

    const iconMap = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-triangle-fill',
        warning: 'bi-exclamation-circle-fill',
        info: 'bi-info-circle-fill'
    };

    const iconClass = iconMap[status] || 'bi-info-circle-fill';

    alertDiv.innerHTML = `
        <div class="alert-icon">
            <i class="bi ${iconClass}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-message">${message}</div>
        </div>
        <button type="button" class="btn-close" aria-label="Close"></button>
    `;

    container.appendChild(alertDiv);

    requestAnimationFrame(() => {
        alertDiv.classList.add('show');
    });

    const closeAlert = () => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 400); // Should match the transform transition duration
    };

    alertDiv.querySelector('.btn-close').addEventListener('click', closeAlert);

    if (duration !== null) {
        setTimeout(closeAlert, duration);
    }
}