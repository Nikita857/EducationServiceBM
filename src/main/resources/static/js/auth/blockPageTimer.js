const timerElement = document.getElementById('timer');
let timeLeft = parseInt(timerElement.dataset.duration);

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

timerElement.textContent = formatTime(timeLeft);

const countdown = setInterval(() => {
    if (timeLeft <= 0) {
        clearInterval(countdown);
        timerElement.textContent = '00:00';
        window.location.href='/login';
    } else {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
    }
}, 1000)