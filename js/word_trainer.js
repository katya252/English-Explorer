let words = [];  // Массив для хранения слов
let currentWordIndex = 0; // Индекс текущего слова
let correctAnswer = ''; // Переменная для хранения правильного ответа

// Загружаем слова из words.json
fetch('/json/words.json')
  .then(response => response.json())
  .then(data => {
    words = data; // Присваиваем загруженные данные в массив
    nextQuestion(); // Запускаем первый вопрос
  })
  .catch(error => console.error('Ошибка загрузки данных слов:', error));

function shuffleAnswers() {
  // Список вариантов ответа (включая правильный)
  const answers = [
    correctAnswer,  // Обязательно включаем правильный ответ
    ...getRandomWords(3)  // Добавляем 3 случайных слова (не повторяются)
  ];

  // Перемешиваем массив
  answers.sort(() => Math.random() - 0.5);

  // Очищаем контейнер с опциями
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';  // Очистка предыдущих вариантов

  // Создаём новые элементы для вариантов ответа
  answers.forEach((answer) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.textContent = answer;
    optionElement.addEventListener('click', () => checkAnswer(answer));  // Обработчик клика
    optionsContainer.appendChild(optionElement);
  });
}

function getRandomWords(count) {
  // Функция для получения случайных слов (без дублирования)
  const randomWords = [];
  const usedIndices = new Set();  // Множество для проверки повторений

  while (randomWords.length < count) {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (!usedIndices.has(randomIndex)) {
      randomWords.push(words[randomIndex].english);  // Добавляем английское слово
      usedIndices.add(randomIndex);  // Помечаем индекс как использованный
    }
  }

  return randomWords;
}

function nextQuestion() {
  if (words.length > 0) {
    // Выбираем случайное слово
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];

    // Убираем выбранное слово, чтобы оно не повторялось
    words.splice(randomIndex, 1);

    // Записываем правильный ответ
    correctAnswer = word.english;

    // Отображаем русское слово для перевода
    document.getElementById('current-word').textContent = word.russian;

    // Перемешиваем ответы, включая правильный
    shuffleAnswers();

    document.getElementById('message').textContent = ''; // Скрыть предыдущий результат
  } else {
    document.getElementById('message').textContent = 'Вы прошли все вопросы!';
  }
}

function checkAnswer(selectedAnswer) {
  const messageElement = document.getElementById('message');

  const correctResponses = [
  "Отлично! Ты правильно перевёл!",
    "Молодец! Верный перевод!",
    "Здорово! Всё правильно!",
    "Ты справился! Продолжай учиться!",
    "Умничка! Отличная работа!"
  ];

  const wrongResponses = [
    "Ой, пока неверно. Попробуй ещё раз!",
    "Почти получилось! Давай ещё!",
    "Немного не так. Попробуй снова!",
    "Не сдавайся! Ты сможешь!",
    "Чуть-чуть промахнулся. Подумай ещё!"
  ];

  if (selectedAnswer === correctAnswer) {
    const randomIndex = Math.floor(Math.random() * correctResponses.length);
    messageElement.textContent = correctResponses[randomIndex];
    messageElement.classList.add('correct');
    messageElement.classList.remove('incorrect');
    setTimeout(nextQuestion, 1000);
  } else {
    const randomIndex = Math.floor(Math.random() * wrongResponses.length);
    messageElement.textContent = wrongResponses[randomIndex];
    messageElement.classList.add('incorrect');
    messageElement.classList.remove('correct');
  }
}