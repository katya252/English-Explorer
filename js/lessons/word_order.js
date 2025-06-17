let sentences = [];
let currentSentence = {};
let draggedElement = null;
let startX, startY, initialLeft, initialTop;
let isDragging = false;
let placeholder = null; // Указатель для вставки

// Загрузка данных из JSON
async function loadSentences() {
  try {
    const response = await fetch('/json/lessons/word_order.json');
    const data = await response.json();

    // Получаем выбранный класс из localStorage (по умолчанию '2')
    const selectedClass = localStorage.getItem('selectedClass') || '2';

    // Фильтруем предложения по выбранному классу
    sentences = data.sentences.filter(sentence => sentence.class == selectedClass);
    
    loadNewSentence(); // Загружаем новое предложение
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

// Загрузка нового случайного предложения
function loadNewSentence() {
  // Если предложения пустые (например, нет предложений для выбранного класса)
  if (sentences.length === 0) {
    document.getElementById("word-container").innerText = "Нет заданий для выбранного класса.";
    return;
  }

  // Выбираем случайное предложение
  currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  // Очищаем обратную связь
  const feedback = document.getElementById("feedback");
  feedback.innerText = "";

  // Перемешивание слов и добавление их в контейнер
  shuffleArray(currentSentence.words).forEach(word => {
    const wordElement = document.createElement("span");
    wordElement.className = "word";
    wordElement.innerText = word;
    wordElement.draggable = true;

    // Добавляем обработчики для перетаскивания
    if ('ontouchstart' in window) {
      // Для мобильных устройств
      wordElement.addEventListener("touchstart", handleTouchStart, { passive: false });
      wordElement.addEventListener("touchend", handleTouchEnd);
      wordElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    } else {
      // Для компьютеров
      wordElement.addEventListener("dragstart", handleDragStart);
      wordElement.addEventListener("dragend", handleDragEnd);
      wordElement.addEventListener("dragover", handleDragOver);
      wordElement.addEventListener("drop", handleDrop);
    }

    wordContainer.appendChild(wordElement);
  });

  // Создаём placeholder, который будет показывать место вставки
  placeholder = document.createElement("span");
  placeholder.className = "placeholder";
  placeholder.style.display = "none"; // Скрыт по умолчанию
  wordContainer.appendChild(placeholder);

  // Устанавливаем зону, куда можно перетаскивать
  wordContainer.addEventListener("dragover", handleDragOver);
  wordContainer.addEventListener("drop", handleDrop);
}

// Перемешивание массива
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Обработчики для перетаскивания (мышь)
function handleDragStart(event) {
  event.target.classList.add("dragging");
  event.dataTransfer.setData("text", event.target.innerText);
}

function handleDragEnd(event) {
  event.target.classList.remove("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  const draggingElement = document.querySelector(".dragging");
  const container = document.getElementById("word-container");
  const afterElement = getDragAfterElement(container, event.clientX);
  if (afterElement == null) {
    container.appendChild(draggingElement);
  } else {
    container.insertBefore(draggingElement, afterElement);
  }
}

function handleDrop(event) {
  event.preventDefault();
  const draggingElement = document.querySelector(".dragging");
  const container = document.getElementById("word-container");
  const afterElement = getDragAfterElement(container, event.clientX);
  if (afterElement == null) {
    container.appendChild(draggingElement);
  } else {
    container.insertBefore(draggingElement, afterElement);
  }
}

// Функция для получения элемента, после которого вставить перетаскиваемый элемент
function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll(".word:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Обработчики для сенсорного ввода (мобильные устройства)
function handleTouchStart(event) {
  event.preventDefault();

  draggedElement = event.target;
  isDragging = true;

  // Запоминаем начальную позицию
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;

  initialLeft = draggedElement.offsetLeft;
  initialTop = draggedElement.offsetTop;

  draggedElement.classList.add("dragging");
}

function handleTouchMove(event) {
  if (!draggedElement || !isDragging) return;

  event.preventDefault(); // Останавливаем прокрутку при перетаскивании

  const touch = event.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  // Обновляем позицию перетаскиваемого элемента
  draggedElement.style.position = "absolute";
  draggedElement.style.left = initialLeft + deltaX + "px";
  draggedElement.style.top = initialTop + deltaY + "px";

  // Проверка на соседний элемент
  const wordContainer = document.getElementById("word-container");
  const words = [...wordContainer.children].filter(word => word !== placeholder);

  // Находим элемент, после которого нужно вставить перетаскиваемый элемент
  let afterElement = null;
  for (const word of words) {
    if (word === draggedElement) continue;
    const rect = word.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    if (touch.clientX > centerX) {
      afterElement = word;
    }
  }

  if (afterElement) {
    wordContainer.insertBefore(placeholder, afterElement);
  } else {
    wordContainer.appendChild(placeholder);
  }

  placeholder.style.display = "inline"; // Показываем placeholder
}

function handleTouchEnd(event) {
  if (!draggedElement) return;

  event.preventDefault();
  draggedElement.classList.remove("dragging");

  // Восстанавливаем позицию элемента в контейнере (если нужно)
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";

  // Вставляем элемент в правильное место
  const wordContainer = document.getElementById("word-container");
  const words = [...wordContainer.children].filter(word => word !== placeholder);

  // Находим, после какого элемента вставлять
  let afterElement = null;
  for (const word of words) {
    if (word === draggedElement) continue;
    const rect = word.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    if (event.changedTouches[0].clientX > centerX) {
      afterElement = word;
    }
  }

  if (afterElement) {
    wordContainer.insertBefore(draggedElement, afterElement);
  } else {
    wordContainer.appendChild(draggedElement);
  }

  // Убираем placeholder
  placeholder.style.display = "none";

  draggedElement = null;
  isDragging = false;
}
function checkWordOrder() {
  const userOrder = Array.from(document.querySelectorAll("#word-container .word"))
    .map(wordElement => wordElement.innerText)
    .join(" ");

  const feedback = document.getElementById("feedback");

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

  if (userOrder === currentSentence.correct_order) {
    const randomPositive = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
    feedback.innerText = randomPositive;
    feedback.style.color = "#4ade80";
    setTimeout(loadNewSentence, 2000);
  } else {
    const randomNegative = negativeFeedbacks[Math.floor(Math.random() * negativeFeedbacks.length)];
    feedback.innerText = randomNegative;
    feedback.style.color = "#ff4d4d";
  }
}

// Запуск при загрузке страницы
window.onload = loadSentences;