// Анимация для поиска
document.addEventListener('DOMContentLoaded', function() {
    const searchCollapse = document.getElementById('searchCollapse');
    if (searchCollapse) { // Проверяем, существует ли элемент
        searchCollapse.addEventListener('show.bs.collapse', function () {
            setTimeout(() => {
                this.querySelector('input').focus();
            }, 100);
        });
    }
});

