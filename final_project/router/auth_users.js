const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.filter((user) => user.username === username).length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    for (const user of users) {
        if (username === user.username && password === user.password) {
            return true;
        }
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    // Check if username and password matches
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username: username }, "customer", { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }

        return res.send("Customer successfully logged in.");
    } else {
        return res.status(401).send("Invalid username and/or password.");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (isbn in books) {
        books[isbn].reviews[username] = review;
        return res.send(`Review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).send(`There is no book with the given ISBN ${isbn}.`);
    }    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
