const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Конфигурация подключения к SQL Server
const config = {
  user: 'SASHA',  // Имя пользователя
  password: '123', // Пароль
  server: 'DESKTOP-IT24VJ0', // Сервер
  database: 'EnglishExplorer', // База данных
  options: {
    encrypt: true, // Для безопасного соединения
    trustServerCertificate: true, // Для локального использования
  }
};

// Подключение к базе данных и запуск сервера
sql.connect(config).then(pool => {
  console.log('Подключение к базе данных успешно!');  // Лог успешного подключения

  // Настройка middleware для обработки JSON
  app.use(bodyParser.json());

  // Пример регистрации нового пользователя
  app.post('/register', async (req, res) => {
    const { name, login, password } = req.body;

    try {
      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Проверка на существование пользователя
      const checkUser = await pool.request()
        .input('Login', sql.NVarChar, login)
        .query('SELECT * FROM Users WHERE Login = @Login');
      
      if (checkUser.recordset.length > 0) {
        return res.status(400).send('Пользователь с таким логином уже существует.');
      }

      // Регистрация нового пользователя
      await pool.request()
        .input('Name', sql.NVarChar, name)
        .input('Login', sql.NVarChar, login)
        .input('Password', sql.NVarChar, hashedPassword)
        .query('INSERT INTO Users (Name, Login, Password) VALUES (@Name, @Login, @Password)');

      res.status(200).send('Пользователь зарегистрирован успешно!');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).send('Ошибка при регистрации');
    }
  });

  // Пример авторизации
  app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
      const result = await pool.request()
        .input('Login', sql.NVarChar, login)
        .query('SELECT * FROM Users WHERE Login = @Login');

      if (result.recordset.length > 0) {
        const storedHashedPassword = result.recordset[0].Password;
        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (isMatch) {
          return res.status(200).send('Авторизация успешна');
        }
      }

      res.status(400).send('Неверный логин или пароль');
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      res.status(500).send('Ошибка при авторизации');
    }
  });

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
  });
}).catch(err => {
  console.error('Ошибка подключения:', err);
});