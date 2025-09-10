async function submitOfferForm(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Получаем данные из формы
    const form = event.target;
    const formData = new FormData(form);

    // Формируем объект для отправки
    const offerData = {
        userId: parseInt(formData.get('userId').trim()), // Преобразуем в число
        topic: formData.get('topic').trim(),
        description: formData.get('description').trim()

    };

    try {
        const response = await fetch('/api/offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(offerData)
        });

        console.log(JSON.stringify(offerData));

        if (!response.ok) {
            const errorData = await response.json();
            showAlert("Ошибка: "+ response.status+" "+errorData.message.get(), 'error')
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Оффер создан:', result);
        showAlert("Предложение отправлено!", 'success');
    } catch (error) {
        showAlert("Не удалосб отправить заявку", 'error');
    }
}

// Привязка обработчика к форме
document.getElementById('sendOffer').addEventListener('submit', submitOfferForm);
