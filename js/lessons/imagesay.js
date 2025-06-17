let images = [];
let currentImageIndex = 0;

async function loadImages() {
  try {
    const response = await fetch('/json/lessons/imagesay.json');
    const data = await response.json();

    images = data.images;

    if (images.length === 0) {
      document.getElementById("feedback").innerText = "Нет изображений для отображения.";
      return;
    }

    shuffleImages();
    displayImage();
  } catch (error) {
    console.error("Ошибка загрузки изображений:", error);
    document.getElementById("feedback").innerText = "Ошибка загрузки изображений.";
  }
}

function shuffleImages() {
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
}

function displayImage() {
  const image = images[currentImageIndex];
  document.getElementById("image").src = image.src;
  document.getElementById("image").alt = image.answer;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
}

function checkAnswer() {
  const userInput = document.getElementById("answer").value.trim().toLowerCase();
  const correctAnswer = images[currentImageIndex].answer.toLowerCase();

  const positiveFeedbacks = [
    "Молодец! Всё правильно!",
    "Отлично! Так держать!",
    "Правильный ответ! У тебя хорошо получается!",
    "Замечательно! Ещё один правильный ответ!",
    "Ты справился! Продолжай в том же духе!"
  ];

  const negativeFeedbacks = [
    "Ой, не совсем так. Попробуй ещё раз!",
    "Ничего страшного! Подумай ещё!",
    "Почти получилось, попробуй снова!",
    "Не сдавайся! У тебя всё получится!",
    "Давай ещё разок, ты сможешь!"
  ];

  if (userInput === correctAnswer) {
    const randomPositive = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
    document.getElementById("feedback").innerText = randomPositive;
    document.getElementById("feedback").style.color = "limegreen";
    setTimeout(() => {
      nextImage();
    }, 1500);
  } else {
    const randomNegative = negativeFeedbacks[Math.floor(Math.random() * negativeFeedbacks.length)];
    document.getElementById("feedback").innerText = randomNegative;
    document.getElementById("feedback").style.color = "crimson";
  }
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  displayImage();
}

window.onload = loadImages;