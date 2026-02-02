document.addEventListener('DOMContentLoaded', function () {
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationBadge = document.querySelector('.badge-notification');
    const markAllReadBtn = document.getElementById('mark-all-as-read-btn');

    // --- Core Functions ---

    function fetchNotifications() {
        fetch('/api/notifications')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch notifications');
                return response.json();
            })
            .then(updateNotificationUI)
            .catch(error => console.error('Error fetching notifications:', error));
    }

    function markAsReadAndRedirect(notificationId, redirectLink) {
        fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
            .then(response => {
                if (response.ok && redirectLink) {
                    window.location.href = redirectLink;
                } else if (!response.ok) {
                    showAlert('Не удалось отметить уведомление как прочитанное.', 'error');
                }
            })
            .catch(error => console.error('Error marking notification as read:', error));
    }

    function markOneAsRead(notificationId, itemElement) {
        fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    // Optimistically remove from UI
                    itemElement.remove();
                    updateBadgeCount(getNotificationCount() - 1);
                } else {
                    showAlert('Не удалось отметить уведомление как прочитанное.', 'error');
                }
            })
            .catch(error => console.error('Error marking one notification as read:', error));
    }

    function markAllAsRead() {
        fetch('/api/notifications/read-all', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    updateNotificationUI([]); // Clear UI with an empty array
                } else {
                    showAlert('Не удалось отметить все уведомления как прочитанные.', 'error');
                }
            })
            .catch(error => console.error('Error marking all as read:', error));
    }

    // --- UI Update Functions ---

    function updateNotificationUI(notifications) {
        clearNotificationList();
        updateBadgeCount(notifications.length);

        if (notifications.length > 0) {
            const header = notificationDropdown.querySelector('.dropdown-header');
            notifications.forEach(notification => {
                const item = createNotificationItem(notification);
                // Insert after the header
                header.parentNode.insertBefore(item, header.nextSibling);
            });
            markAllReadBtn.style.display = 'block';
        } else {
            showNoNotificationsMessage();
            markAllReadBtn.style.display = 'none';
        }
    }

    function createNotificationItem(notification) {
        const item = document.createElement('li');

        const contentLink = document.createElement('a');
        contentLink.className = 'notification-content';
        contentLink.innerHTML = `<small>${notification.message}</small>`;
        contentLink.addEventListener('click', (e) => {
            e.preventDefault();
            markAsReadAndRedirect(notification.id, notification.link);
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'notification-actions';
        
        const markReadBtn = document.createElement('button');
        markReadBtn.className = 'btn-mark-read';
        markReadBtn.type = 'button';
        markReadBtn.title = 'Пометить как прочитанное';
        markReadBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
        markReadBtn.addEventListener('click', () => {
            markOneAsRead(notification.id, item);
        });

        actionsDiv.appendChild(markReadBtn);

        item.className = 'notification-item';
        item.appendChild(contentLink);
        item.appendChild(actionsDiv);

        return item;
    }

    function clearNotificationList() {
        const items = notificationDropdown.querySelectorAll('.notification-item');
        items.forEach(item => item.remove());
        // Remove "no new notifications" message if it exists
        const emptyMsg = notificationDropdown.querySelector('.dropdown-item-text');
        if(emptyMsg) emptyMsg.parentElement.remove();
    }

    function showNoNotificationsMessage() {
        const listItem = document.createElement('li');
        listItem.innerHTML = '<span class="dropdown-item-text text-muted text-center d-block py-2">Нет новых уведомлений</span>';
        // Insert after the divider
        const divider = notificationDropdown.querySelector('.dropdown-divider');
        divider.parentNode.insertBefore(listItem, divider.previousSibling);
    }

    function updateBadgeCount(count) {
        if (count > 0) {
            notificationBadge.textContent = count;
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.textContent = '0';
            notificationBadge.style.display = 'none';
        }
    }

    function getNotificationCount() {
        return notificationDropdown.querySelectorAll('.notification-item').length;
    }

    // --- Initial Setup ---

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllAsRead);
    }

    fetchNotifications();
});
