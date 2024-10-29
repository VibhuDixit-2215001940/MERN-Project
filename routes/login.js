// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// GET login page
router.get('/login', (req, res) => {
    res.render('home/login');
});

// POST login handler
router.post('/login', async (req, res) => {
    const { username, userpass } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.render('home/login', { error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(userpass, user.password);
    if (!isMatch) {
        return res.render('home/login', { error: 'Incorrect password' });
    }
    // Update last login time
    user.lastLogin = new Date(); // Set current date and time
    await user.save(); // Save the user with updated last login
    
    // Save user session data
    req.session.userId = user._id;
    req.session.userName = user.fname; // Save the user's first name in the session
    res.redirect('/YourPost');
});

// Middleware to check if the user is logged in
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        res.locals.userName = req.session.userName; // Make userName available in views
        return next();
    }
    res.redirect('/login');
}


// Use the middleware in the /YourPost route
router.get('/YourPost', ensureAuthenticated, (req, res) => {
    res.render('YourPost/index'); // Render the /YourPost page after login
});

// POST register handler
router.post('/register', async (req, res) => {
    const { username, uemail, fname, lname, userpass, re_enter } = req.body;

    if (userpass !== re_enter) {
        return res.render('home/login', { error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.render('home/login', { error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(userpass, 10);
    const newUser = new User({
        username,
        email: uemail,
        fname,
        lname,
        password: hashedPassword,
    });

    await newUser.save();
    res.redirect('/login');
});

module.exports = router;
