import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Инициализация Firebase с конфигурацией
const firebaseConfig = {
    apiKey: "AIzaSyDk6gLM6CpGHbFB2G_omL301SQKE16e018",
    authDomain: "englishexplorer-bee31.firebaseapp.com",
    databaseURL: "https://englishexplorer-bee31-default-rtdb.firebaseio.com",
    projectId: "englishexplorer-bee31",
    storageBucket: "englishexplorer-bee31.firebasestorage.app",
    messagingSenderId: "657377678224",
    appId: "1:657377678224:web:80e708e0c0057713001915"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
