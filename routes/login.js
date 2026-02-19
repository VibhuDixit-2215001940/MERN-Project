// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();
const Complain = require('../models/Complain');
const multer = require('multer');
const path = require('path');

router.get('/login', (req, res) => {
    res.render('home/login');
});
router.post('/login', async (req, res) => {
    console.log("Login Attempt:", req.body);
    const { username, userpass } = req.body;

    // Allow login with either Username OR Email
    const user = await User.findOne({
        $or: [{ username: username }, { email: username }]
    });

    if (!user) {
        console.log("Login Failed: User not found -", username);
        return res.render('home/login', { error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(userpass, user.password);
    if (!isMatch) {
        console.log("Login Failed: Wrong password -", username);
        return res.render('home/login', { error: 'Incorrect password' });
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.userId = user._id;
    req.session.userName = user.fname;
    req.session.userImage = user.image;

    console.log("Login Success! Redirecting to /YourPost for user:", user.username);
    res.redirect('/YourPost');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/YourPost');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        res.locals.userName = req.session.userName;
        res.locals.userImage = req.session.userImage;
        return next();
    }
    res.redirect('/login');
}
router.get('/YourPost', ensureAuthenticated, (req, res) => {
    try {
        console.log("Rendering /YourPost for", req.session.userName);
        res.render('YourPost/index', {
            userName: req.session.userName || 'Guest',
            userImage: req.session.userImage || 'images/default.png'
        });
    } catch (err) {
        console.error('Error rendering /YourPost:', err);
        res.redirect('/Err');
    }
});

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Path to store uploaded files
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename file
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size (1MB in this case)
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('garbage'); // 'garbage' is the field name in your form

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Your existing POST route
router.post('/YourPost', upload, async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body
    console.log('Uploaded File:', req.file); // Log the uploaded file information

    const { wastetype, comment, phoneno, email, address } = req.body;

    // Basic validation
    if (!wastetype || !phoneno || !email || !address) {
        return res.render('complain/complain.ejs', { error: 'Please fill in all required fields.' });
    }

    const newComplain = new Complain({
        wastetype,
        comment,
        phoneno,
        email,
        address,
        image: req.file ? req.file.path : null
    });

    try {
        await newComplain.save();
        await User.findByIdAndUpdate(req.session.userId, { $inc: { complaintsCount: 1 } });
        res.redirect('/YourPost');
    } catch (error) {
        console.error('Error saving complaint:', error);
        // res.render('complain/complain.ejs', { error: 'Failed to submit the complaint. Please try again later.' });
        res.redirect('/Err');
    }
});


router.post('/register', async (req, res) => {
    const { username, uemail, fname, lname, userpass, re_enter } = req.body;
    if (userpass !== re_enter) {
        return res.render('home/login', { error: "Passwords do not match" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).+$/;
    if (!passwordRegex.test(userpass)) {
        return res.render('home/login', { error: "Password must contain at least one lowercase letter, one number, and one special character." });
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