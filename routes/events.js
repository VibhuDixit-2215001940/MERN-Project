const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
router.get('/Event', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const userinfo = await User.findById(req.session.userId);
        const events = await Event.find();
        if (!userinfo) {
            return res.status(404).send("User not found");
        }
        res.render('events/events.ejs', { user: userinfo ,events:events });
    } catch (error) {
        console.error(error);
        res.redirect('/Err');
    }
});

module.exports = router;
