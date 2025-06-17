document.addEventListener("DOMContentLoaded", () => {
  const classSelect = document.getElementById("class-select");
  
  classSelect.addEventListener("change", loadModules);  // Слушаем изменение выбора класса
  loadModules();  // Загружаем модули при начальной загрузке
  
});

// Получаем элемент для отображения контента
const moduleContent = document.getElementById('module-content');

// Функция для загрузки контента модуля
function loadModuleContent(module) {
    // Конвертируем Markdown в HTML
    const htmlContent = marked(module.content);
    
    // Создаем HTML-структуру для модуля
    const moduleHTML = `
        <h2>${module.title}</h2>
        <p class="description">${module.description}</p>
        ${htmlContent}
    `;
    
    // Устанавливаем контент
    moduleContent.innerHTML = moduleHTML;
    moduleContent.style.display = 'block';
}

// Пример использования (замените на ваш способ получения данных)
fetch('/path/to/modules.json')
    .then(response => response.json())
    .then(data => {
        // Предположим, что вы хотите загрузить первый модуль
        loadModuleContent(data.modules[0]);
    });

  
// Пример использования (замените на ваш способ получения контента)
fetch('/path/to/your/content.md')
    .then(response => response.text())
    .then(loadModuleContent);

function loadModules() {
  
  const modulesContainer = document.getElementById("modules-container");
  const selectedClass = document.getElementById("class-select").value;  // Получаем выбранный класс
  const progressBar = document.getElementById("progress-bar");
  

  // Очистка содержимого перед загрузкой
  modulesContainer.innerHTML = "";

  // Получение прогресса пользователя из localStorage
  let userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};

  // Если для текущего класса нет информации, инициализируем пустой массив
  if (!userProgress[selectedClass]) {
    userProgress[selectedClass] = [];
  }

  fetch("/json/modules.json")
    .then((response) => response.json())
    .then((data) => {
      const classModules = data.modules.filter(module => module.class === parseInt(selectedClass));
      
      classModules.forEach((module, index) => {
        const moduleElement = document.createElement("div");
        moduleElement.className = "module";

        // Проверяем, завершён ли урок, и можем ли мы разблокировать следующий
        const isUnlocked =
          index === 0 ||  // Первый урок всегда доступен
          userProgress[selectedClass].includes(module.id - 1);  // Урок разблокируется, если завершён предыдущий

        moduleElement.innerHTML = `
          <div class="module-title">${module.title}</div>
          <div class="module-description">${module.description}</div>
          <button class="start-lesson" ${isUnlocked ? "" : "disabled"}>
            ${isUnlocked ? "Начать урок" : "Недоступно"}
          </button>
        `;

        if (isUnlocked) {
          moduleElement.querySelector("button").onclick = () => openModule(module);
        }

        modulesContainer.appendChild(moduleElement);
      });

      // Обновляем прогресс
      const completedModules = userProgress[selectedClass].length;
      const totalModules = classModules.length;
      const progress = Math.round((completedModules / totalModules) * 100);
      progressBar.value = progress;
    })
    .catch((error) => console.error("Ошибка загрузки модулей:", error));
}

function openModule(module) {
  const catalog = document.getElementById("catalog");
  const moduleContent = document.getElementById("module-content");

  catalog.style.display = "none";
  moduleContent.style.display = "block";

  moduleContent.innerHTML = `
    <button class="back-button" onclick="goBack()">Назад</button>
    <h2>${module.title}</h2>
    <div class="module-markdown">${marked.parse(module.content)}</div>
    <button class="complete-lesson" onclick="completeLesson(${module.class}, ${module.id})">Завершить урок</button>
  `;
}

function completeLesson(classId, moduleId) {
  let userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};

  // Если для выбранного класса нет прогресса, создаем пустой массив
  if (!userProgress[classId]) {
    userProgress[classId] = [];
  }

  // Добавляем завершённый урок в прогресс
  if (!userProgress[classId].includes(moduleId)) {
    userProgress[classId].push(moduleId);
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  }

  alert("Урок завершён! Следующий урок разблокирован.");

  // Обновляем доступность уроков и прогресс
  loadModules();

  // Возвращаемся на главную страницу
  goBack();
}

function goBack() {
  const catalog = document.getElementById("catalog");
  const moduleContent = document.getElementById("module-content");

  moduleContent.style.display = "none";
  catalog.style.display = "block";
}