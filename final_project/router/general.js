const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { // Calls the function here
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Capture the ISBN from the URL
  const book = books[isbn];     // Look up the book in your data source

  if (book) {
      return res.status(200).json(book); // Send book details if found
  } else {
      return res.status(404).json({ message: "Book not found" }); // Handle missing book
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Capture the author name from the URL
  const booksByAuthor = [];
  
  // Get all keys (ISBNs) from the 'books' object
  const isbnKeys = Object.keys(books);
  
  // Iterate through the books to find matches
  isbnKeys.forEach((isbn) => {
      if (books[isbn].author === author) {
          booksByAuthor.push({
              isbn: isbn,
              ...books[isbn]
          });
      }
  });

  if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Send back found books
  } else {
      return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Capture title from URL
  const booksByTitle = [];
  
  // Convert book object keys to an array to iterate
  const isbnKeys = Object.keys(books);
  
  // Check each book for a matching title
  isbnKeys.forEach((isbn) => {
      if (books[isbn].title === title) {
          booksByTitle.push({
              isbn: isbn,
              ...books[isbn]
          });
      }
  });

  if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Send found books
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn; // Get ISBN from URL
    const book = books[isbn];     // Locate the book in the records

    if (book) {
        // Return only the reviews of the book
        return res.status(200).json(book.reviews);
    } else {
        // Handle case where ISBN does not exist
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
