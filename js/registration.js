document.addEventListener("DOMContentLoaded", function () {
  const toRegisterLink = document.getElementById('toRegisterLink');
  const toLoginLink = document.getElementById('toLoginLink');
  const loginWindow = document.getElementById('loginWindow');
  const registerWindow = document.getElementById('registerWindow');

  // Переход на окно регистрации
  toRegisterLink.addEventListener('click', function (event) {
    event.preventDefault();
    loginWindow.classList.add('hidden');
    registerWindow.classList.remove('hidden');
  });

  // Переход на окно авторизации
  toLoginLink.addEventListener('click', function (event) {
    event.preventDefault();
    registerWindow.classList.add('hidden');
    loginWindow.classList.remove('hidden');
  });

  // Обработчик для регистрации
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const login = document.getElementById('registerLogin').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    // Регистрация пользователя в Firebase
    createUserWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        // Регистрация успешна
        const user = userCredential.user;
        user.updateProfile({
          displayName: name
        }).then(() => {
          alert('Регистрация успешна!');
          loginWindow.classList.remove('hidden');
          registerWindow.classList.add('hidden');
        }).catch((error) => {
          alert("Ошибка обновления профиля: " + error.message);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Ошибка регистрации: " + errorMessage);
      });
  });

  // Обработчик для авторизации
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    // Авторизация пользователя в Firebase
    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        // Авторизация успешна
        const user = userCredential.user;
        alert('Добро пожаловать, ' + user.displayName);
        // Здесь можно добавить редирект на главный экран
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Ошибка авторизации: " + errorMessage);
      });
  });
});