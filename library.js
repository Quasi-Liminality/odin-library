const myLibrary = [];
const dialog = document.querySelector('dialog');

function Book(title, author, releaseYear, hasRead) {
    this.title = title;
    this.author = author;
    this.releaseYear = releaseYear;
    this.hasRead = hasRead;
    this.id = self.crypto.randomUUID();
}

Book.prototype.toggleReadStatus = function() {
    this.hasRead = !this.hasRead;
};

function addBookToLibrary(title, author, releaseYear, hasRead) {
    const book = new Book(title, author, releaseYear, hasRead);
    myLibrary.push(book);
}

function removeBookFromLibrary(bookId) {
    myLibrary.splice(getBookIndex(bookId), 1);
}

function getBookIndex(bookId) {
    return myLibrary.findIndex(item => item.id === bookId);
}

function displayLibrary() {
    const tableBody = document.querySelector('tbody');
    const tableRows = [];

    for (book of myLibrary) {
        let newTableRow = document.createElement('tr');

        for (prop in book) {
            // Ensures we don't iterate over the prototype's methods
            if (!book.hasOwnProperty(prop)) {
                continue;
            }

            let tableData = document.createElement('td');
            if (prop === 'id') {
                let deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                tableData.appendChild(deleteButton);
                newTableRow.dataset.bookId = book[prop]; // Adds book id to entire row
            } else if (prop === 'hasRead') {
                let readCheckBox = document.createElement('input');                
                readCheckBox.type = 'checkbox';
                readCheckBox.className = 'toggle-read';
                readCheckBox.checked = book[prop];
                tableData.appendChild(readCheckBox);
            } else {
                tableData.textContent = book[prop];
            }
            newTableRow.appendChild(tableData);
        }
        tableRows.push(newTableRow);
    }
    tableBody.replaceChildren(...tableRows);
}

document.querySelector('#submitBook').addEventListener('click', handleBookSubmission);
function handleBookSubmission() {
    const form = document.querySelector('form');
    if(!form.checkValidity()) {
        return;
    }

    const formInputs = Array.from(document.querySelectorAll('form input'));
    const bookData = formInputs.map(input => {
        if (input.type === 'checkbox') {
            return input.checked;
        } else {
            return input.value;
        }
    });
    addBookToLibrary(...bookData);
    displayLibrary();
    document.querySelector('form').reset();
    document.querySelector('dialog').close();
}

document.querySelector('.books').addEventListener('click', handleLibraryInteraction);
function handleLibraryInteraction(e) {
    const bookId = e.target.closest('[data-book-id]').dataset.bookId;
    if (e.target.className === 'delete-btn') {
        removeBookFromLibrary(bookId);
        displayLibrary();
    } else if (e.target.className === 'toggle-read') {
        const book = myLibrary[getBookIndex(bookId)];
        book.toggleReadStatus();
    }
}

document.querySelector('#addBook').addEventListener('click', () => {
    document.querySelector('dialog').showModal();
});

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 1937, false);
addBookToLibrary('1984', 'George Orwell', 1949, true);
addBookToLibrary('Neuromancer', 'William Gibson', 1984, true);
displayLibrary();