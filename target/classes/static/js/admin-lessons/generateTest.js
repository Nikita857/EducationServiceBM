// Массив для хранения вопросов
let questions = [];

// Добавление первого вопроса при загрузке
document.addEventListener('DOMContentLoaded', function() {
    addQuestion();
});

// Функция добавления вопроса
function addQuestion() {
    const questionCount = document.getElementById('questionCount').value;
    const questionsContainer = document.getElementById('questionsContainer');

    questionsContainer.innerHTML = '';

    for (let i = 0; i < questionCount; i++) {
        const questionHTML = `
            <div class="card mb-3 question-card" data-index="${i}">
                <div class="card-header bg-dark text-light">
                    <h6 class="mb-0">Вопрос ${i + 1}</h6>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Текст вопроса:</label>
                        <input type="text" class="form-control question-text" 
                               placeholder="Введите текст вопроса" required>
                    </div>
                    
                    <div class="answers-container">
                        <div class="answer-row mb-2">
                            <div class="input-group">
                                <input type="text" class="form-control answer-text" 
                                       placeholder="Вариант ответа 1" required>
                                <div class="input-group-text">
                                    <input type="radio" class="form-check-input correct-answer" 
                                           name="correctAnswer${i}" value="0" required>
                                </div>
                            </div>
                        </div>
                        <div class="answer-row mb-2">
                            <div class="input-group">
                                <input type="text" class="form-control answer-text" 
                                       placeholder="Вариант ответа 2" required>
                                <div class="input-group-text">
                                    <input type="radio" class="form-check-input correct-answer" 
                                           name="correctAnswer${i}" value="1" required>
                                </div>
                            </div>
                        </div>
                        <div class="answer-row mb-2">
                            <div class="input-group">
                                <input type="text" class="form-control answer-text" 
                                       placeholder="Вариант ответа 3" required>
                                <div class="input-group-text">
                                    <input type="radio" class="form-check-input correct-answer" 
                                           name="correctAnswer${i}" value="2" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button type="button" class="btn btn-outline-danger btn-sm mt-2" 
                            onclick="removeQuestion(${i})">
                        <i class="fas fa-trash me-1"></i> Удалить вопрос
                    </button>
                </div>
            </div>
        `;

        questionsContainer.innerHTML += questionHTML;
    }
}

// Удаление вопроса
function removeQuestion(index) {
    const questionCount = document.getElementById('questionCount').value;
    document.getElementById('questionCount').value = Math.max(1, questionCount - 1);
    addQuestion();
}

// Обработка отправки формы
document.getElementById('testGeneratorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateTestCode();
});

// Генерация кода теста
function generateTestCode() {
    const questionCards = document.querySelectorAll('.question-card');
    const generatedQuestions = [];

    questionCards.forEach((card, index) => {
        const questionText = card.querySelector('.question-text').value;
        const answerInputs = card.querySelectorAll('.answer-text');
        const correctAnswerIndex = parseInt(card.querySelector('.correct-answer:checked').value);

        const answers = [];
        answerInputs.forEach((input, answerIndex) => {
            answers.push({
                text: input.value,
                correct: answerIndex === correctAnswerIndex
            });
        });

        generatedQuestions.push({
            question: questionText,
            answers: answers
        });
    });

    // Форматирование кода
    const code = `const questions = [
${generatedQuestions.map((q, i) => `    {
        question: "${q.question.replace(/"/g, '\\"')}",
        answers: [
${q.answers.map((a, ai) => `            { text: "${a.text.replace(/"/g, '\\"')}", correct: ${a.correct} }`).join(',\n')}
        ]
    }`).join(',\n')}
];`;

    // Отображение результата
    document.getElementById('generatedCode').textContent = code;
    document.getElementById('resultContainer').style.display = 'block';

    // Сохранение для копирования
    window.generatedCode = code;
}

// Копирование в буфер обмена
function copyToClipboard() {
    if (!window.generatedCode) return;

    navigator.clipboard.writeText(window.generatedCode).then(() => {
        alert('Код скопирован в буфер обмена!');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        alert('Не удалось скопировать код');
    });
}



// Обновление количества вопросов
document.getElementById('questionCount').addEventListener('change', addQuestion);