let currentQuestion = 0;
let score = 0;

function startQuiz(questions) {
    currentQuestion = 0;
    score = 0;
    showQuestion(questions);
    new bootstrap.Modal(document.getElementById('quizModal')).show();
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const current = questions[currentQuestion];

    questionElement.textContent = `${current.question}`;
    $('#questionCounter').text(`Вопрос ${currentQuestion+1} из 10`);
    $('#score').text(`${score} баллов`);
    answersElement.innerHTML = '';

    current.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-primary mb-2';
        button.textContent = answer.text;
        button.onclick = () => checkAnswer(index);
        answersElement.appendChild(button);
    });
}

function checkAnswer(index) {
    const current = questions[currentQuestion];
    if (current.answers[index].correct) {
        ++score;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Saving user progress function. It collects data from modal quiz hidden inputs and send to rest controller which insert that into database

function saveUserProgress() {
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    const progressData = {
        userId: document.getElementById('userId').value,
        lessonId: document.getElementById('lessonId').value,
        moduleId: document.getElementById('moduleId').value,
        courseId: document.getElementById('courseId').value
    };

    console.log('Sending progress data:', progressData);

    fetch('/api/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(progressData)
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Server error');
                });
            }
            return response.text();
        })
        .then(data => {
            console.log('Success:', data);
            showAlert('Урок пройден!', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Ошибка: ' + error.message, 'error');
        });
}

function showResult() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
        if(score >=8) {
            questionElement.textContent = `Тест пройден! Ваш результат: ${score} из ${questions.length}`;
            saveUserProgress();
        }else{
            questionElement.textContent = `Тест не пройден! Ваш результат: ${score} из ${questions.length}`;
        }
    answersElement.innerHTML = '';
}


