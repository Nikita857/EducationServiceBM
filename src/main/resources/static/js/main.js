// Анимация для поиска
    document.addEventListener('DOMContentLoaded', function() {
    const searchCollapse = document.getElementById('searchCollapse');
    searchCollapse.addEventListener('show.bs.collapse', function () {
    setTimeout(() => {
    this.querySelector('input').focus();
}, 100);
});
});
