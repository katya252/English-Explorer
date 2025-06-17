async function loadWords() {
  try {
      const response = await fetch('/json/dictionary.json');
      const data = await response.json();
      displayWords(data.words);
  } catch (error) {
      console.error("Ошибка загрузки данных:", error);
  }
}

function displayWords(words) {
  const tableBody = document.querySelector("#dictionary-table tbody");
  tableBody.innerHTML = "";

  words.forEach(word => {
      const row = document.createElement("tr");

      const wordCell = document.createElement("td");
      wordCell.textContent = word.word;
      row.appendChild(wordCell);

      const transcriptionCell = document.createElement("td");
      transcriptionCell.textContent = word.transcription;
      row.appendChild(transcriptionCell);

      const translationCell = document.createElement("td");
      translationCell.textContent = word.translation;
      row.appendChild(translationCell);

      tableBody.appendChild(row);
  });
  document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#dictionary-table tbody tr');
  
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const text = Array.from(cells).map(cell => cell.innerText.toLowerCase()).join(' ');
      if (text.includes(filter)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Загружаем данные при загрузке страницы
window.onload = loadWords;