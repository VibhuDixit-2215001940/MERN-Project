const express = require('express');
const router = express.Router();
const path = require('path');
const BusinessUser = require('../models/BusinessUser');
const { v4: uuidv4 } = require('uuid');
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/BusinessLogin'); 
}
function generateShortId() {
    return uuidv4().split('-').join('').slice(0, 8); 
}
router.get('/BusinessLogin', async (req, res) => {
    res.render('Business/BusinessLogin.ejs');
});
router.get('/Business', async (req, res) => {
    res.render('Business/index.ejs');
});
router.post('/signupp', async (req, res) => {
    const { newUserName, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    try {
        const user = new BusinessUser({ username: newUserName, password: newPassword });
        await user.save();
        res.redirect('/BusinessLogin');
    } catch (err) {
        res.redirect('/Err');
    }
});
router.post('/loginn', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await BusinessUser.findOne({ username: userName });
        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id; 
            res.redirect('/Business');
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (err) {
        res.redirect('/Err');
    }
});
router.get('/BusinessProfile', async (req, res) => {
    try {
        const user = await BusinessUser.findById(req.session.userId).lean();
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('Business/profile.ejs',{ user })
    } catch (err) {
        console.error(err);
        res.redirect('/Err');
    }
});

module.exports = router;
