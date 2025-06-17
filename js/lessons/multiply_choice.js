let questions = [];
let currentQuestionIndex = 0;

// Загрузка данных из JSON
async function loadQuestions() {
  try {
    const response = await fetch('/json/lessons/multiply_choice.json');
    const data = await response.json();

    // Получаем выбранный класс из localStorage (по умолчанию '2')
    const selectedClass = localStorage.getItem('selectedClass') || '2';

    // Фильтруем вопросы по выбранному классу
    questions = data.questions.filter(question => question.class == selectedClass);

    loadNextQuestion(); // Загружаем следующий вопрос
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

// Функция для перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Функция для отображения следующего вопроса
function loadNextQuestion() {
  // Скрываем предыдущий результат
  document.getElementById("feedback").innerText = "";

  // Загружаем случайный вопрос
  currentQuestionIndex = Math.floor(Math.random() * questions.length);
  const question = questions[currentQuestionIndex];

  // Создаем массив объектов для сохранения индексов
  const optionsWithIndex = question.options.map((option, index) => ({
    text: option,
    isCorrect: option === question.answer,
  }));

  // Перемешиваем массив вариантов
  const shuffledOptions = shuffleArray(optionsWithIndex);

  // Обновляем текст предложения
  document.getElementById("sentence").innerText = question.sentence;

  // Обновляем текст кнопок с новыми вариантами ответов
  const optionButtons = document.querySelectorAll(".options button");
  shuffledOptions.forEach((option, index) => {
    optionButtons[index].innerText = option.text;
    optionButtons[index].onclick = () => checkAnswer(option.isCorrect); // Передаем, верен ли вариант
  });
}

// Функция для проверки ответа
function checkAnswer(isCorrect) {
  const feedback = document.getElementById("feedback");

  const positiveFeedbacks = [
    "Отлично!",
    "Молодец! Так держать!",
    "Класс! Продолжай в том же духе!",
    "Всё лучше и лучше!",
    "Замечательно!"
  ];

  const negativeFeedbacks = [
    "Ой, попробуй ещё раз!",
    "Немного не так, давай ещё!",
    "Не сдавайся, у тебя получится!",
    "Почти правильно! Попробуй снова.",
    "Чуть-чуть промахнулся. Ещё разок!"
  ];

  if (isCorrect) {
    const randomPositive = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
    feedback.innerText = randomPositive;
    feedback.style.color = "#4ade80";
    setTimeout(loadNextQuestion, 2000);
  } else {
    const randomNegative = negativeFeedbacks[Math.floor(Math.random() * negativeFeedbacks.length)];
    feedback.innerText = randomNegative;
    feedback.style.color = "#ff4d4d";
  }
}

// Загрузка вопросов при загрузке страницы
window.onload = loadQuestions;