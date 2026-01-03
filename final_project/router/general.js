const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Unable to register user. Username and/or password are not provided."});
  }

  if (isValid(username)) {
    return res.status(404).json({message: "User already exists!"});
  }

  users.push({"username":username,"password":password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Helper function to get books using Promise (Axios-like pattern)
const getBooks = () => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate async operation - in a real scenario, this would be an Axios call
      // Example: axios.get('http://api.example.com/books').then(resolve).catch(reject)
      setTimeout(() => {
        resolve({ data: books }); // Axios returns { data: ... } structure
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};

// Get the book list available in the shop using async-await with Axios pattern
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    // Using async-await pattern with Axios-like Promise
    const response = await getBooks();
    // Axios returns data in response.data
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Helper function to get book by ISBN using Promise (Axios-like pattern)
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate async operation - in a real scenario, this would be an Axios call
      // Example: axios.get(`http://api.example.com/books/${isbn}`).then(resolve).catch(reject)
      setTimeout(() => {
        if (books[isbn]) {
          resolve({ data: books[isbn] }); // Axios returns { data: ... } structure
        } else {
          reject({ message: "Book not found", status: 404 });
        }
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};

// Get book details based on ISBN using async-await with Axios pattern
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    // Using async-await pattern with Axios-like Promise
    const response = await getBookByISBN(isbn);
    // Axios returns data in response.data
    return res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({message: error.message || "Error fetching book details", error: error.message});
  }
 });
  
// Helper function to get books by author using Promise (Axios-like pattern)
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate async operation - in a real scenario, this would be an Axios call
      // Example: axios.get(`http://api.example.com/books?author=${author}`).then(resolve).catch(reject)
      setTimeout(() => {
        const matchingBooks = {};
        
        for (let isbn in books) {
          if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks[isbn] = books[isbn];
          }
        }
        
        if (Object.keys(matchingBooks).length > 0) {
          resolve({ data: matchingBooks }); // Axios returns { data: ... } structure
        } else {
          reject({ message: "No books found for this author", status: 404 });
        }
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};

// Get book details based on author using async-await with Axios pattern
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    // Using async-await pattern with Axios-like Promise
    const response = await getBooksByAuthor(author);
    // Axios returns data in response.data
    return res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({message: error.message || "Error fetching books by author", error: error.message});
  }
});

// Helper function to get books by title using Promise (Axios-like pattern)
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate async operation - in a real scenario, this would be an Axios call
      // Example: axios.get(`http://api.example.com/books?title=${encodeURIComponent(title)}`).then(resolve).catch(reject)
      setTimeout(() => {
        const decodedTitle = decodeURIComponent(title);
        const matchingBooks = {};
        
        for (let isbn in books) {
          if (books[isbn].title.toLowerCase() === decodedTitle.toLowerCase()) {
            matchingBooks[isbn] = books[isbn];
          }
        }
        
        if (Object.keys(matchingBooks).length > 0) {
          resolve({ data: matchingBooks }); // Axios returns { data: ... } structure
        } else {
          reject({ message: "No books found with this title", status: 404 });
        }
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};

// Get all books based on title using async-await with Axios pattern
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    // Using async-await pattern with Axios-like Promise
    const response = await getBooksByTitle(title);
    // Axios returns data in response.data
    return res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({message: error.message || "Error fetching books by title", error: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;