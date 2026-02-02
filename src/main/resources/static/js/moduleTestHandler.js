document.addEventListener('DOMContentLoaded', function () {
    const testForm = document.getElementById('testForm');
    if (testForm) {
        testForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const moduleId = this.dataset.moduleId;
            const answers = [];
            const questions = document.querySelectorAll('.question-card');

            questions.forEach((question, index) => {
                const questionTextElement = question.querySelector('.question-text strong');
                const questionText = question.querySelector('.question-text').innerHTML.replace(questionTextElement.outerHTML, '').trim();
                const selectedAnswer = question.querySelector('input[name="question_' + index + '"]:checked');
                
                if (selectedAnswer) {
                    answers.push({
                        question: questionText,
                        answer: selectedAnswer.value
                    });
                }
            });

            const submission = {
                answers: answers
            };

            fetch(`/api/module/${moduleId}/check-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission)
            })
            .then(response => response.json())
            .then(result => {
                const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
                const resultText = document.getElementById('resultText');
                const isCompleted = document.getElementById('isCompleted');
                const percentage = result.percentage.toFixed(2);
                
                let message = `Ваш результат: ${result.score} из ${result.totalQuestions} (${percentage}%).`;
                resultText.textContent = message;

                if (percentage >= 80) {
                    isCompleted.textContent = 'Тест пройден!'
                    resultText.classList.add('text-success');
                    resultText.classList.remove('text-danger');
                    setTimeout(()=>{
                        history.back()
                    },5000)
                } else {
                    isCompleted.textContent = 'Тест не пройден!'
                    resultText.classList.add('text-danger');
                    resultText.classList.remove('text-success');
                    setTimeout(()=>{
                        history.back()
                    },5000)
                }

                resultModal.show();
            })
            .catch(error => {
                console.error('Error:', error);
                const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
                const resultText = document.getElementById('resultText');
                resultText.textContent = 'Произошла ошибка при отправке теста.';
                resultText.classList.add('text-danger');
                resultModal.show();
            });
        });
    }
});
