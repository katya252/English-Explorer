// Функция для загрузки данных из JSON
async function loadTasks() {
  try {
    const response = await fetch('/json/lessons/audio_exercise.json');
    const data = await response.json();

    // Проверяем, что данные загружены
    if (!data.tasks || data.tasks.length === 0) {
      console.error("Задания не найдены в JSON.");
      return;
    }

    tasks = data.tasks;
    console.log("Задания загружены:", tasks);

    // Устанавливаем случайное задание
    setTask();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

function setTask() {
  if (tasks.length === 0) {
    console.error("Нет заданий для отображения.");
    return;
  }

  // Скрываем сообщение о правильности ответа перед новым заданием
  document.getElementById("feedback").innerText = '';
  document.getElementById("feedback").style.color = '';

  // Очищаем поле для нового ответа
  const answerInput = document.getElementById("userAnswer");
  answerInput.value = '';

  // Выбираем случайное задание
  const randomIndex = Math.floor(Math.random() * tasks.length);
  currentTask = tasks[randomIndex]; 
  console.log("Текущее задание:", currentTask);

  // Проверяем, есть ли текст задания
  if (!currentTask.text) {
    console.error("Текст задания не найден.");
    return;
  }

  // Показываем текст задания на странице
  document.getElementById("task").innerText = currentTask.text;
  document.getElementById("task").style.display = "block"; // Показываем задание

  // Отображаем кнопку для проверки ответа
  document.querySelector(".option").style.display = "inline-block"; 
}

// Функция для проверки ответа пользователя
function checkAnswer() {
  const userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
  const correctAnswer = currentTask.correctAnswer.trim().toLowerCase(); // Предположим, что в JSON есть свойство correctAnswer

  // Показать сообщение о правильности ответа
  const resultMessage = document.getElementById("feedback");

  if (userAnswer === correctAnswer) {
    resultMessage.innerText = "Правильный ответ!";
    resultMessage.style.color = "#4ade80";
  } else {
    resultMessage.innerText = "Неправильный ответ, попробуйте снова.";
    resultMessage.style.color = "#ff4d4d";
  }

  // Обновляем задание через 2 секунды
  setTimeout(() => {
    setTask(); // Обновляем задание
  }, 2000);
}