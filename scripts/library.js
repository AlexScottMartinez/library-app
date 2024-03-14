let myLibrary = [
    {
        title: "No Exit",
        author: "Taylor Adams",
        pages: 368,
        read: true
    }
];
  
// DOM Objects
addButtonObj = document.querySelector('.add-button');
tableObj = document.querySelector('.table');
tbodyObj = tableObj.querySelector('tbody');
  
formObj = document.querySelector('.form');
titleInputObj = formObj.querySelector('#title');
authorInputObj = formObj.querySelector('#author');
pagesInputObj = formObj.querySelector('#pages');
submitButtonObj = formObj.querySelector('#submit');
returnButtonObj = formObj.querySelector('#return');
  
function Book(title, author, pages, read) 
{
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}
  
const addBookToLibrary = () => 
{
    let title = titleInputObj.value;
    let author = authorInputObj.value;
    let pages = pagesInputObj.value;
    let read = getReadValue();
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}
  
const populateStorage = () => 
{
    localStorage.setItem('library', JSON.stringify(myLibrary));
}
  
const getStorage = () => 
{
    myLibrary = JSON.parse(localStorage.getItem('library'));
}
  
const getReadValue = () => 
{
    if(formObj.querySelector('input[name="read"]:checked').value == 'yes') return true;
    else return false;
}
  
const toggleHiddenElements = () => 
{
    formObj.classList.toggle('hidden');
    tableObj.classList.toggle('hidden');
    addButtonObj.classList.toggle('hidden');
}
  
const addError = (el) => 
{
    let spanErrorObj = document.createElement('span');
    spanErrorObj.textContent = `Please enter a ${el.id}`;
    spanErrorObj.id = `${el.id}Error`
    spanErrorObj.classList.add('errorText');
    formObj.insertBefore(spanErrorObj, el);
  
    el.classList.add('errorInput');
  
    el.addEventListener('input', removeError);
}
  
const removeError = (el) => 
{
    if (el.target.value != '') 
    {
        el.target.removeEventListener('input', removeError);
        el.target.classList.remove('errorInput');
        document.querySelector(`#${el.target.id}Error`).remove();
    }
}
  
const validateForm = () => 
{
    if (titleInputObj.value == "" && document.querySelector('#titleError') == null) addError(titleInputObj);
    if (authorInputObj.value == "" && document.querySelector('#authorError') == null) addError(authorInputObj);
    if (pagesInputObj.value == "" && document.querySelector('#pagesError') == null) addError(pagesInputObj);
  
    if (titleInputObj.value == "" || pagesInputObj.value == "" || authorInputObj.value == "") return false;
    else return true;
  
}
  
const clearForm = () => 
{
    titleInputObj.value = "";
    authorInputObj.value = "";
    pagesInputObj.value = "";
}
  
const createReadStatusTd = (book) => 
{
    let readStatusObj = document.createElement('td');
    let readStatusButtonObj = document.createElement('button');
    readStatusButtonObj.textContent = 'Change read status';
    readStatusButtonObj.addEventListener('click', () => 
    {
        book.read = !book.read;
        updateTable();
    });
    readStatusObj.appendChild(readStatusButtonObj);
    return readStatusObj;
}
  
const removeFromLibrary = (index) => 
{
    myLibrary.splice(index, 1)
    submitButtonObj.removeEventListener('click', removeFromLibrary);
    updateTable();
}
  
const createEditTd = (book, index) => 
{
    let editObj = document.createElement('td');
    let editButtonObj = document.createElement('button');
    editButtonObj.textContent = 'Edit';
    editButtonObj.addEventListener('click', () => 
    {
      titleInputObj.value = book.title;
      authorInputObj.value = book.author
      pagesInputObj.value = book.pages
      book.read ? formObj.querySelector('#yes').checked = true : formObj.querySelector('#no').checked = true;
      toggleHiddenElements();
      submitButtonObj.addEventListener('click', removeFromLibrary);
    });
    editObj.appendChild(editButtonObj);
    return editObj;
}
  
const createDeleteTd = (index) => 
{
    let deleteObj = document.createElement('td');
    let deleteButtonObj = document.createElement('button');
    deleteButtonObj.textContent = 'Delete';
    deleteButtonObj.addEventListener('click', () => 
    {
      myLibrary.splice(index, 1);
      updateTable();
    });
    deleteObj.appendChild(deleteButtonObj);
    return deleteObj;
}
  
const updateTable = () => 
{
    tbodyObj.textContent = '';
  
    myLibrary.forEach((book, index) => 
    {
        let rowObj = document.createElement('tr');
        Object.keys(book).forEach(prop => 
        {
            let newDataObj = document.createElement('td');
            newDataObj.textContent = book[prop];
            if (prop == 'read') newDataObj.textContent = book[prop] ? 'Read' : 'Not read';
            rowObj.appendChild(newDataObj);
        }); 
  
        rowObj.appendChild(createReadStatusTd(book));
        rowObj.appendChild(createEditTd(book, index));
        rowObj.appendChild(createDeleteTd(index));
        tbodyObj.appendChild(rowObj);
    });
  
    populateStorage();
}
  
document.addEventListener('DOMContentLoaded', () => 
{
    pagesInputObj.addEventListener('input', () => {if(!pagesInputObj.validity.valid) pagesInputObj.value='' });
    
    addButtonObj.addEventListener('click', toggleHiddenElements);
  
    submitButtonObj.addEventListener('click', () => 
    {
        if (validateForm() == false) return;
        addBookToLibrary();
        updateTable();
        toggleHiddenElements();
        clearForm();
    });
  
    returnButtonObj.addEventListener('click', () => 
    {
        toggleHiddenElements();
        clearForm();
    });
  
    if(!localStorage.getItem('library')) 
    {
        populateStorage();
    } 
    else {
        getStorage();
    }
  
    updateTable();
});