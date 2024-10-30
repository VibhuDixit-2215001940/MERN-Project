const express = require('express');
const router = express.Router();
const session = require('express-session');
const Event = require('../models/Event');
const User = require('../models/User'); 
const Complain = require('../models/Complain'); 
const BusinessUser = require('../models/BusinessUser');

router.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/AdminLogin');
}
router.get('/AdminLogin', (req, res) => {
    res.render('Admin/adminLogin.ejs');
});
router.post('/AdminLogin', async (req, res) => {
    const { Username, password } = req.body;
    console.log('Username:', Username);
    console.log('Password:', password);

    if (Username === 'admin' && password === 'admin') {
        req.session.userId = 'Admin';
        res.redirect('/Admin');
    } else {
        res.status(401).send('Invalid username or password');
    }
});
router.get('/Admin', ensureAuthenticated, async (req, res) => {
    try {
        const eventCount = await Event.countDocuments(); 
        const userCount = await User.countDocuments();
        const complainCount = await Complain.countDocuments();
        const businessCount = await BusinessUser.countDocuments();
        const userData = {
            name: req.session.userId,
            lastLogin: new Date().toLocaleString(),
        };
        res.render('Admin/index.ejs', {
            activeComplaints: complainCount, 
            activeusers: userCount,
            activeBiddings: businessCount, 
            activeEvents: eventCount, 
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
router.get('/AdminLogout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/Admin');
        }
        res.redirect('/');
    });
});
module.exports = router;
