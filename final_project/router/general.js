const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (username && password) {
        // Checks if username is still available
        if (isValid(username)) {
            users.push({
                username: username,
                password: password
            });

            res.send("Customer successfully registered. Now you can login");
        } else {
            res.status(404).send("User already exists!");
        }
    } else {
        return res.status(404).send("Username and/or Password missing.");
    }    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return res.json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();

    let bookList = {        
        booksbyauthor: []
    };

    for (let isbn in books) {        
        const book = books[isbn];
                
        if (author === book.author.toLowerCase()) {
            bookList.booksbyauthor.push({
                isbn: isbn,
                title: book.title,
                review: book.reviews
            });
        }
    }

    return res.json(bookList);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    
    let bookList = {
        booksbytitle: []
    };

    for (let isbn in books) {
        const book = books[isbn];

        if (title === book.title.toLowerCase()) {
            bookList.booksbytitle.push({
                isbn: isbn,
                author: book.author,
                review: book.reviews
            });
        }
    }

    return res.json(bookList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    return res.json(book ? book.reviews: {});
});

module.exports.general = public_users;
