if (endTime) {
    const countdownElement = document.getElementById('countdown');
    const targetDate = new Date(endTime).getTime();

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "<h4>Сайт должен быть уже доступен. Попробуйте <a href='/login'>обновить страницу</a>.</h4>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let countdownText = "<h4>Примерное время до окончания работ:</h4>";
        countdownText += `<p class="display-6">${days}д : ${hours}ч : ${minutes}м : ${seconds}с</p>`;
        countdownElement.innerHTML = countdownText;

    }, 1000);
}