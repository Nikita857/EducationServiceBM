document.addEventListener('DOMContentLoaded', function () {
    const testGeneratorTab = document.getElementById('create-lesson-test-tab');

    // Если на странице нет вкладки генератора тестов, ничего не делаем.
    if (!testGeneratorTab) {
        return;
    }

    const questionsContainer = testGeneratorTab.querySelector('#questionsContainer');
    const testGeneratorForm = testGeneratorTab.querySelector('#testGeneratorForm');

    let questionCounter = 0;

    function createQuestionNode(questionIndex) {
        const questionId = `question-${questionIndex}`;
        const node = document.createElement('div');
        node.className = 'card bg-dark border-secondary mb-4 question-card';
        node.id = questionId;

        node.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Вопрос <span class="question-number">${questionIndex + 1}</span></h6>
                <button type="button" class="btn btn-outline-danger btn-sm remove-question-btn">
                    <i class="bi bi-trash"></i> Удалить
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="${questionId}-text" class="form-label">Текст вопроса:</label>
                    <input type="text" id="${questionId}-text" class="form-control question-text" placeholder="Введите текст вопроса" required>
                </div>
                <div class="answers-container">
                    <label class="form-label">Варианты ответов (отметьте правильный):</label>
                    ${[0, 1, 2].map(answerIndex => `
                        <div class="input-group mb-2">
                            <input type="text" class="form-control answer-text" placeholder="Вариант ответа ${answerIndex + 1}" required>
                            <div class="input-group-text">
                                <input class="form-check-input correct-answer-radio" type="radio" name="${questionId}-correct" value="${answerIndex}" required>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        node.querySelector('.remove-question-btn').addEventListener('click', function() {
            node.remove();
            updateQuestionNumbers();
        });

        return node;
    }

    function updateQuestionNumbers() {
        const allQuestions = questionsContainer.querySelectorAll('.question-card');
        allQuestions.forEach((question, index) => {
            question.querySelector('.question-number').textContent = index + 1;
        });
    }

    function addNewQuestion() {
        const newNode = createQuestionNode(questionCounter);
        questionsContainer.appendChild(newNode);
        questionCounter++;
        updateQuestionNumbers();
    }

    // --- ИСПРАВЛЕНИЕ: Используем делегирование событий ---
    testGeneratorTab.addEventListener('click', function(event) {
        // Проверяем, был ли клик по кнопке "Добавить вопрос"
        if (event.target && event.target.id === 'addQuestionBtn') {
            addNewQuestion();
        }
    });

    if (testGeneratorForm) {
        testGeneratorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateTestCode();
        });
    }

    function generateTestCode() {
        const questionCards = questionsContainer.querySelectorAll('.question-card');
        const generatedQuestions = [];
        let isValid = true;

        if (questionCards.length === 0) {
            showAlert('Пожалуйста, добавьте хотя бы один вопрос.', 'info');
            return;
        }

        questionCards.forEach((card) => {
            const questionText = card.querySelector('.question-text').value;
            const answerInputs = card.querySelectorAll('.answer-text');
            const correctAnswerRadio = card.querySelector('.correct-answer-radio:checked');

            if (!questionText || !correctAnswerRadio) {
                isValid = false;
            }

            const answers = [];
            answerInputs.forEach((input, answerIndex) => {
                if (!input.value) {
                    isValid = false;
                }
                answers.push({
                    text: input.value,
                    correct: answerIndex === parseInt(correctAnswerRadio.value)
                });
            });

            generatedQuestions.push({
                question: questionText,
                answers: answers
            });
        });

        if (!isValid) {
            showAlert('Пожалуйста, заполните все текстовые поля и выберите правильный ответ для каждого вопроса.', 'info');
            return;
        }

        const code = `const questions = [\n${generatedQuestions.map(q => 
`    {\n        question: "${q.question.replace(/"/g, '\\"')}",\n        answers: [\n${q.answers.map(a => 
`            { text: "${a.text.replace(/"/g, '\\"')}", correct: ${a.correct} }`).join(',\n')}\n        ]\n    }`
).join(',\n')}\n];`;

        document.getElementById('generatedCode').textContent = code;
        document.getElementById('resultContainer').style.display = 'block';
        window.generatedCodeForCopy = code;
    }

    // Добавляем первый вопрос только один раз, когда вкладка становится видимой
    const tabObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class' && testGeneratorTab.classList.contains('active')) {
                // Если контейнер пуст, добавляем первый вопрос
                if (questionsContainer.children.length === 0) {
                    addNewQuestion();
                }
            }
        });
    });

    tabObserver.observe(testGeneratorTab, { attributes: true });
});

function copyToClipboard() {
    if (!window.generatedCodeForCopy) return;
    navigator.clipboard.writeText(window.generatedCodeForCopy).then(() => {
        showAlert('Код скопирован в буфер обмена!', 'success');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        showAlert('Не удалось скопировать код', 'error');
    });
}
