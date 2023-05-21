// Define book collection
let books = JSON.parse(localStorage.getItem('books')) || [];
let bookToEdit;

// Define modals and forms
const modals = {
  delete: {
    modal: document.getElementById('deleteModal'),
    form: document.getElementById('deleteBook'),
    closeButton: document.getElementById('deleteCloseButton'),
  },
  edit: {
    modal: document.getElementById('editModal'),
    form: document.getElementById('editBook'),
    closeButton: document.getElementById('editCloseButton'),
  },
};

const bookSubmit = document.getElementById('bookSubmit');
const inputBookIsComplete = document.getElementById(
  'inputBookIsComplete'
);

// Event listeners
inputBookIsComplete.addEventListener('change', function () {
  bookSubmit.innerHTML =
    'Masukkan Buku ke rak <span>' +
    (this.checked ? 'Selesai dibaca' : 'Belum selesai dibaca') +
    '</span>';
});

Object.values(modals).forEach(({ modal, form, closeButton }) => {
  closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
    form.reset();
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      form.reset();
    }
  };
});

modals.edit.form.addEventListener('submit', function (e) {
  e.preventDefault();

  const book = {
    id: bookToEdit.id,
    title: e.target.querySelector('#editBookTitle').value,
    author: e.target.querySelector('#editBookAuthor').value,
    year: e.target.querySelector('#editBookYear').value,
    isComplete: e.target.querySelector('#editBookIsComplete').checked,
  };

  updateBook(book.id, book);
  modals.edit.modal.style.display = 'none';
  modals.edit.form.reset();
});

// Initial load
if (localStorage.getItem('books')) {
  books = JSON.parse(localStorage.getItem('books'));
  renderData(books);
}

const bookForm = document.getElementById('inputBook');
bookForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const book = {
    id: +new Date(),
    title: e.target.querySelector('#inputBookTitle').value,
    author: e.target.querySelector('#inputBookAuthor').value,
    year: e.target.querySelector('#inputBookYear').value,
    isComplete: e.target.querySelector('#inputBookIsComplete')
      .checked,
  };

  if (bookForm.dataset.id) {
    updateBook(bookForm.dataset.id, book);
  } else {
    addBook(book);
  }

  e.target.reset();
  bookForm.dataset.id = '';
});

function addBook(book) {
  books.push(book);
  saveData();
  renderData(books);
}

function removeBook(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    saveData();
    renderData(books);
  }
}

function updateBook(id, newBook) {
  books = books.map((book) => (book.id === id ? newBook : book));
  saveData();
  renderData(books);
}

function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
}

function renderData(data) {
  const incompleteBookshelfList = document.getElementById(
    'incompleteBookshelfList'
  );
  const completeBookshelfList = document.getElementById(
    'completeBookshelfList'
  );

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  data.forEach(function (book) {
    const bookElement = document.createElement('article');
    bookElement.classList.add('book_item');

    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div class="action">
        <button class="change-status green">${
          book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'
        }</button>
        <button class="red">Hapus buku</button>
      </div>
    `;

    const editButton = document.createElement('button');
    editButton.classList.add('blue');
    editButton.textContent = 'Edit buku';
    editButton.addEventListener('click', function () {
      const { modal, form } = modals.edit;
      form.querySelector('#editBookTitle').value = book.title;
      form.querySelector('#editBookAuthor').value = book.author;
      form.querySelector('#editBookYear').value = book.year;
      form.querySelector('#editBookIsComplete').checked =
        book.isComplete;

      modal.style.display = 'block';
      bookToEdit = book; // Save the book to edit
    });

    const changeStatusButton =
      bookElement.querySelector('.change-status');
    changeStatusButton.addEventListener('click', function () {
      book.isComplete = !book.isComplete;
      updateBook(book.id, book);
    });

    const deleteButton = bookElement.querySelector('.red');
    deleteButton.addEventListener('click', function () {
      const { modal, form } = modals.delete;
      form.querySelector('#deleteBookTitle').value = book.title;
      form.querySelector('#deleteBookAuthor').value = book.author;
      form.querySelector('#deleteBookYear').value = book.year;
      form.querySelector('#deleteBookIsComplete').checked =
        book.isComplete;

      modal.style.display = 'block';
      bookToEdit = book; // Save the book to delete
    });

    bookElement.querySelector('.action').prepend(editButton);

    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  });
}

// Searching books
const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = e.target.querySelector('#searchBookTitle').value;
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );
  renderData(filteredBooks);
});
