document.addEventListener('DOMContentLoaded', function () {
    const notificationDropdown = document.querySelector('.dropdown-menu');
    const notificationBadge = document.querySelector('.badge-notification');

    function fetchNotifications() {
        fetch('/api/notifications')
            .then(response => response.json())
            .then(notifications => {
                updateNotificationUI(notifications);
            })
            .catch(error => console.error('Error fetching notifications:', error));
    }

    function updateNotificationUI(notifications) {
        // Clear existing notifications
        while (notificationDropdown.children.length > 1) {
            notificationDropdown.removeChild(notificationDropdown.lastChild);
        }

        if (notifications.length > 0) {
            notificationBadge.textContent = notifications.length;
            notificationBadge.style.display = 'block';

            notifications.forEach(notification => {
                const listItem = document.createElement('li');
                const button = document.createElement('button');
                button.className = 'dropdown-item text-dark';
                button.type = 'button';
                button.innerHTML = `<small>${notification.message}</small>`;
                button.addEventListener('click', function () {
                    markAsRead(notification.id, notification.link);
                });
                listItem.appendChild(button);
                notificationDropdown.appendChild(listItem);
            });
        } else {
            notificationBadge.style.display = 'none';
            const listItem = document.createElement('li');
            listItem.innerHTML = '<span class="dropdown-item-text">Нет новых уведомлений</span>';
            notificationDropdown.appendChild(listItem);
        }
    }

    function markAsRead(notificationId, redirectLink) {
        fetch(`/api/notifications/${notificationId}/read`, {
            method: 'POST'
        }).then(() => {
            window.location.href = redirectLink;
        }).catch(error => console.error('Error marking notification as read:', error));
    }

    fetchNotifications();
});
