// Доступ до елементів
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const bookGrid = document.getElementById('bookGrid');
const readerGrid = document.getElementById('readerGrid');
const cardGrid = document.getElementById('cardGrid');
let books = [];
let readers = [];
let cards = [];

function openTab(evt, tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    // Убираем активный класс у всех вкладок и кнопок
    tabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            tab.style.opacity = 0; // Убираем непрозрачность для анимации
            setTimeout(() => {
                tab.classList.remove('active'); // Убираем класс active
                tab.style.display = 'none'; // Скрываем вкладку после анимации
            }, 500); // Задержка должна соответствовать времени анимации
        }
    });

    buttons.forEach(button => button.classList.remove('active'));

    // Активируем кнопку
    evt.currentTarget.classList.add('active');

    // Показываем новую вкладку
    const activeTab = document.getElementById(tabName);
    activeTab.style.display = 'block'; // Сначала показываем новую вкладку
    setTimeout(() => {
        activeTab.classList.add('active'); // Затем добавляем класс active для появления
        activeTab.style.opacity = 1; // Устанавливаем непрозрачность на 1 для плавного появления
    }, 10); // Небольшая задержка, чтобы активировать CSS анимацию
}


// Зміна теми
function toggleTheme() {
    const isLight = body.classList.toggle('light-theme');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
}

// Завантаження книг з HTML
function loadBooksFromHTML() {
    document.querySelectorAll('.book-card').forEach(card => {
        const title = card.querySelector('h3').innerText;
        const author = card.querySelector('p:nth-child(3)').innerText.split(': ')[1];
        const quantity = card.querySelector('p:nth-child(4)').innerText.split(': ')[1];
        const cover = card.querySelector('img').src;

        const newBook = { title, author, quantity, cover };
        books.push(newBook);

        // Кнопка видалення
        card.querySelector('.deleteBookBtn').onclick = () => deleteBook(title, card);
    });
}

// Видалення книги
function deleteBook(title, card) {
    books = books.filter(book => book.title !== title);
    localStorage.setItem('books', JSON.stringify(books));
    card.remove();
}

// Додавання нової книги
function addNewBook() {
    const title = prompt("Введіть назву книги:");
    const author = prompt("Введіть автора книги:");
    const quantity = prompt("Введіть кількість книг:");

    if (title && author && quantity) {
        const newBook = { title, author, quantity, cover: 'images/nnBook.jpg' };
        if (!books.some(book => book.title === title)) {
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            bookGrid.appendChild(createBookCard(newBook));
        } else {
            alert("Книга з такою назвою вже існує.");
        }
    }
}

// Створення карточки книги
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img src="${book.cover}" alt="Обкладинка книги: ${book.title}">
        <h3>${book.title}</h3>
        <p>Автор: ${book.author}</p>
        <p>Кількість: ${book.quantity}</p>
        <button class="deleteBookBtn">Видалити</button>
    `;
    card.querySelector('.deleteBookBtn').onclick = () => deleteBook(book.title, card);
    return card;
}

// Додавання нового читача
function addNewReader() {
    const name = prompt("Введіть ім'я читача:");
    const address = prompt("Введіть адресу читача:");
    const phone = prompt("Введіть телефон читача:");

    if (name && address && phone) {
        const newReader = { name, address, phone };
        if (!readers.some(reader => reader.name === name)) {
            readers.push(newReader);
            localStorage.setItem('readers', JSON.stringify(readers));
            readerGrid.appendChild(createReaderCard(newReader));
        } else {
            alert("Читач з таким ім'ям вже існує.");
        }
    }
}

// Створення карточки читача
function createReaderCard(reader) {
    const card = document.createElement('div');
    card.className = 'reader-card';
    card.innerHTML = `
        <img src="images/human.png" alt="Читач" class="reader-image">
        <h3>${reader.name}</h3>
        <p>Адреса: ${reader.address}</p>
        <p>Телефон: ${reader.phone}</p>
        <button class="deleteReaderBtn">Видалити</button>
    `;
    card.querySelector('.deleteReaderBtn').onclick = () => deleteReader(reader.name, card);
    return card;
}

// Видалення читача
function deleteReader(name, card) {
    readers = readers.filter(reader => reader.name !== name);
    localStorage.setItem('readers', JSON.stringify(readers));
    card.remove();
}

// Збереження картки
function saveCard() {
    const issueDate = prompt("Введіть дату видачі книги (дд.мм.рррр):");
    const readerName = prompt("Введіть ім'я читача:");
    const bookTitle = prompt("Введіть назву книги:");

    if (issueDate && readerName && bookTitle) {
        const newCard = { readerName, bookTitle, issueDate };
        if (!cards.some(card => card.readerName === readerName && card.bookTitle === bookTitle)) {
            cards.push(newCard);
            localStorage.setItem('cards', JSON.stringify(cards));
            cardGrid.appendChild(createCardRow(newCard));
        } else {
            alert("Ця картка вже існує.");
        }
    }
}

// Створення рядка картки
function createCardRow(card) {
    const row = document.createElement('div');
    row.className = 'card-item';
    row.innerHTML = `
        <img src="images/human.png" alt="Читач" class="card-image">
        <div class="card-details">
            <p>Читач: ${card.readerName}</p>
            <img src="images/NoHeart.png" alt="Книга: ${card.bookTitle}" class="book-image">
            <p>Книга: ${card.bookTitle}</p>
            <p>Дата видачі: <span>${card.issueDate}</span></p>
            <button class="deleteCardBtn">Видалити</button>
        </div>
    `;
    row.querySelector('.deleteCardBtn').onclick = () => deleteCard(card.readerName, card.bookTitle, row);
    return row;
}

// Видалення картки
function deleteCard(readerName, bookTitle, row) {
    cards = cards.filter(card => !(card.bookTitle === bookTitle && card.readerName === readerName));
    localStorage.setItem('cards', JSON.stringify(cards));
    row.remove();
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    loadBooksFromHTML();

    // Завантаження читачів
    document.querySelectorAll('.reader-card').forEach(card => {
        const name = card.querySelector('h3').innerText;
        const address = card.querySelector('p:nth-child(3)').innerText.split(': ')[1];
        const phone = card.querySelector('p:nth-child(4)').innerText.split(': ')[1];
        readers.push({ name, address, phone });
        card.querySelector('.deleteReaderBtn').onclick = () => deleteReader(name, card);
    });

    // Завантаження карток
    document.querySelectorAll('.card-item').forEach(card => {
        const readerName = card.querySelector('.reader-name').innerText.split(': ')[1];
        const bookTitle = card.querySelector('.book-title').innerText.split(': ')[1];
        const issueDate = card.querySelector('p:nth-child(4)').innerText.split(': ')[1];
        cards.push({ readerName, bookTitle, issueDate });
        card.querySelector('.deleteCardBtn').onclick = () => deleteCard(readerName, bookTitle, card);
    });

    // Прив'язка подій
    document.getElementById('addReaderBtn').onclick = addNewReader;
    document.getElementById('saveCardBtn').onclick = saveCard;
    document.getElementById('addBookBtn').onclick = addNewBook; 
    themeBtn.onclick = toggleTheme;
});
