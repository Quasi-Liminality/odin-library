class Book {
    constructor([title, author, releaseYear, hasRead]) {
        this.title = title;
        this.author = author;
        this.releaseYear = releaseYear;
        this.hasRead = hasRead;
        this.id = self.crypto.randomUUID();
    }
    
    toggleReadStatus() {
        this.hasRead = !this.hasRead;
    }
}

const Library = (function() {
    const collection = [];
    
    const getBook = (bookID) => {
        return collection.find(item => item.id === bookID);
    };
    
    const insertBook = (bookDetails) => {
        const book = new Book(bookDetails);
        collection.push(book);
    };
    
    const removeBook = (bookID) => {
        const book = getBook(bookID);
        const bookIndex = collection.findIndex(item => item === book);
        collection.splice(bookIndex, 1);
    };
    
    return { collection, getBook, insertBook, removeBook };
})();

// Book Samples
Library.insertBook(['The Hobbit', 'J.R.R. Tolkien', 1937, false]);
Library.insertBook(['1984', 'George Orwell', 1949, true]);
Library.insertBook(['Neuromancer', 'William Gibson', 1984, true]);

const DisplayController = (function() {
    // DOM Cache
    const dialog = document.querySelector('dialog');
    const addBookBtn = document.querySelector('#addBook');
    const submitBookBtn = document.querySelector('#submitBook');
    const libraryTable = document.querySelector('.books');
    const libraryTableBody = document.querySelector('tbody');
    
    // Event Listeners
    addBookBtn.addEventListener('click', () => dialog.showModal());
    submitBookBtn.addEventListener('click', handleBookSubmission);
    libraryTable.addEventListener('click', handleLibraryInteraction);
    
    const renderLibrary = () => {
        const libraryRows = [];
        
        for (const book of Library.collection) {
            let newRow = document.createElement('tr');
        
            for (const prop in book) {
                let tableData = document.createElement('td');
            
                if (prop === 'id') {
                    let deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    tableData.appendChild(deleteButton);
                    newRow.dataset.bookId = book[prop]; // Adds book id to entire row
                } else if (prop === 'hasRead') {
                    let readCheckBox = document.createElement('input');                
                    readCheckBox.type = 'checkbox';
                    readCheckBox.className = 'toggle-read';
                    readCheckBox.checked = book[prop];
                    tableData.appendChild(readCheckBox);
                } else {
                    tableData.textContent = book[prop];
                }
                
                newRow.appendChild(tableData);
            }
            libraryRows.push(newRow);
        }
        libraryTableBody.replaceChildren(...libraryRows);
    };
    
    // Event Handlers
    function handleBookSubmission() {
        const form = document.querySelector('form');
        if(!form.checkValidity()) {
            return;
        }
    
        const formInputs = Array.from(document.querySelectorAll('form input'));
        const bookDetails = formInputs.map(input => {
            if (input.type === 'checkbox') {
                return input.checked;
            } else {
                return input.value;
            }
        });

        Library.insertBook(bookDetails);
        
        renderLibrary();
        
        document.querySelector('form').reset();
        document.querySelector('dialog').close();
    }
    
    function handleLibraryInteraction(e) {
        const bookID = e.target.closest('[data-book-id]').dataset.bookId;
      
        if (e.target.className === 'delete-btn') {
            Library.removeBook(bookID);
            renderLibrary();
        } else if (e.target.className === 'toggle-read') {
            Library.getBook(bookID).toggleReadStatus();
        }
    }

    renderLibrary();
})();
