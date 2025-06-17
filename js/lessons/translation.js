let sentences = [];
let currentSentenceIndex = 0; // Индекс текущего задания

// Функция для загрузки данных из JSON
async function loadSentences() {
  try {
    const response = await fetch('/json/lessons/translation.json');
    const data = await response.json();

    // Получаем выбранный класс из localStorage
    const selectedClass = localStorage.getItem('selectedClass') || '2';

    // Фильтруем предложения по выбранному классу
    sentences = data.sentences.filter(sentence => sentence.class == selectedClass);

    if (sentences.length === 0) {
      document.getElementById("sentence").innerText = "Нет заданий для выбранного класса.";
      return;
    }

    shuffleSentences(); // Перемешиваем массив предложений
    displaySentence(); // Отображаем первое задание
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    document.getElementById("sentence").innerText = "Ошибка загрузки заданий.";
  }
}

// Функция для перемешивания массива предложений
function shuffleSentences() {
  for (let i = sentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс
    [sentences[i], sentences[j]] = [sentences[j], sentences[i]]; // Меняем местами элементы
  }
}

// Функция для отображения текущего задания
function displaySentence() {
  if (sentences.length > 0) {
    const sentence = sentences[currentSentenceIndex];
    document.getElementById("sentence").innerText = sentence.translation; // Показываем русское предложение
    document.getElementById("feedback").innerText = ''; // Очищаем предыдущие ответы
    document.getElementById("translation").value = ''; // Очищаем текстовое поле
  } else {
    document.getElementById("sentence").innerText = "Нет заданий для выбранного класса.";
  }
}

// Функция для проверки перевода
function checkTranslation() {
  const userTranslation = document.getElementById("translation").value.trim(); // Перевод пользователя
  const sentence = document.getElementById("sentence").innerText; // Русское предложение
  const correctTranslation = sentences.find(s => s.translation === sentence)?.original;

  // Массивы фраз для правильных и неправильных ответов
  const positiveFeedbacks = [
    "Отлично! Ты правильно перевёл!",
    "Молодец! Верный перевод!",
    "Здорово! Всё правильно!",
    "Ты справился! Продолжай учиться!",
    "Умничка! Отличная работа!"
  ];

  const negativeFeedbacks = [
    "Ой, пока неверно. Попробуй ещё раз!",
    "Почти получилось! Давай ещё!",
    "Немного не так. Попробуй снова!",
    "Не сдавайся! Ты сможешь!",
    "Чуть-чуть промахнулся. Подумай ещё!"
  ];

  if (correctTranslation) {
    if (userTranslation.toLowerCase() === correctTranslation.toLowerCase()) {
      const randomPositive = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
      document.getElementById("feedback").innerText = randomPositive;
      document.getElementById("feedback").style.color = "limegreen";

      // Переходим к следующему предложению через 2 секунды
      setTimeout(nextSentence, 2000);
    } else {
      const randomNegative = negativeFeedbacks[Math.floor(Math.random() * negativeFeedbacks.length)];
      document.getElementById("feedback").innerText = randomNegative;
      document.getElementById("feedback").style.color = "red";
    }
  } else {
    console.error("Предложение не найдено.");
    document.getElementById("feedback").innerText = "Ошибка. Попробуйте снова.";
    document.getElementById("feedback").style.color = "red";
  }
}

// Функция для перехода к следующему предложению
function nextSentence() {
  currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length; // Увеличиваем индекс
  displaySentence(); // Обновляем предложение
}

// Загружаем данные при загрузке страницы
window.onload = loadSentences;