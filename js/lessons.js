// Загружаем сохраненный класс и отображаем его в select
function loadSelectedClass() {
    const selectedClass = localStorage.getItem('selectedClass') || '2'; // По умолчанию 2 класс
    document.getElementById('class-select').value = selectedClass;
  }
  
  // Сохраняем выбранный класс и обновляем задания
  function loadTasks() {
    const selectedClass = document.getElementById('class-select').value;
    localStorage.setItem('selectedClass', selectedClass);
    console.log(`Выбранный класс: ${selectedClass}`); // Для проверки
  }
  
  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    loadSelectedClass();
    loadTasks();
  });
  