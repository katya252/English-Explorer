let currentTask = null;
let tasks = [];
let recognition;
let recording = false;

// Загружаем задания из JSON
async function loadTasks() {
  try {
    const response = await fetch('/json/lessons/pronunciation.json');
    const data = await response.json();

    // Получаем выбранный класс из localStorage (по умолчанию '2')
    const selectedClass = localStorage.getItem('selectedClass') || '2';

    // Фильтруем задания по выбранному классу
    tasks = data.tasks.filter(task => task.class == selectedClass);
    
    setTask(); // Загружаем новое задание для выбранного класса
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

function setTask() {
  // Останавливаем запись и микрофон при установке нового задания
  if (recording) {
    stopRecognition();
    recording = false;
  }

  // Если нет заданий для выбранного класса
  if (tasks.length === 0) {
    document.getElementById("word-to-pronounce").innerText = "Нет заданий для выбранного класса.";
    document.getElementById("transcription").innerText = "";
    document.getElementById("feedback").innerText = "";
    return;
  }

  currentTask = tasks[Math.floor(Math.random() * tasks.length)];
  document.getElementById("word-to-pronounce").innerText = currentTask.word;
  document.getElementById("transcription").innerText = "";
  document.getElementById("feedback").innerText = "";
  document.querySelector(".record-button").innerText = "Начать запись";
}

function toggleRecording() {
  if (!recording) {
    startRecognition();
    document.querySelector(".record-button").innerText = "Остановить запись";
  } else {
    stopRecognition();
    document.querySelector(".record-button").innerText = "Начать запись";
  }
  recording = !recording;
}

function startRecognition() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const transcriptionElement = document.getElementById("transcription");
    let transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join("");
    transcriptionElement.innerText = transcript;

    if (event.results[0].isFinal) {
      checkAnswer(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error("Ошибка распознавания:", event.error);
  };

  recognition.onaudiostart = () => monitorVolume();
  recognition.start();
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
  }
}

// Функция для проверки ответа
// Функция для проверки ответа
function checkAnswer(userAnswer) {
  const correctAnswer = currentTask.word.trim().toLowerCase();
  const feedback = document.getElementById("feedback");

  const positiveFeedbacks = [
    "Отлично произнесено!",
    "Молодец! Ты правильно сказал!",
    "Класс! Чёткое произношение!",
    "Ты говоришь всё лучше и лучше!",
    "Замечательно! Прямо как настоящий англичанин!"
  ];

  const negativeFeedbacks = [
    "Ой, попробуй ещё раз!",
    "Немного не так, давай ещё!",
    "Не сдавайся, у тебя получится!",
    "Почти правильно! Попробуй снова.",
    "Чуть-чуть промахнулся. Ещё разок!"
  ];

  if (userAnswer.trim().toLowerCase() === correctAnswer) {
    const randomPositive = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
    feedback.innerText = randomPositive;
    feedback.style.color = "#4ade80";
  } else {
    const randomNegative = negativeFeedbacks[Math.floor(Math.random() * negativeFeedbacks.length)];
    feedback.innerText = randomNegative;
    feedback.style.color = "#ff4d4d";
  }

  setTimeout(() => {
    setTask();
  }, 2000);
}

// Мониторинг громкости микрофона
function monitorVolume() {
  const volumeMeter = document.getElementById("volume-level");
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function updateVolume() {
      analyser.getByteFrequencyData(dataArray);
      const volume = Math.max(...dataArray) / 255;
      volumeMeter.style.width = `${volume * 100}%`;

      if (recording) {
        requestAnimationFrame(updateVolume);
      } else {
        audioContext.close();
        stream.getTracks().forEach(track => track.stop());
      }
    }

    updateVolume();
  }).catch(error => console.error("Ошибка доступа к микрофону:", error));
}

// Загрузка заданий при загрузке страницы
window.onload = loadTasks;