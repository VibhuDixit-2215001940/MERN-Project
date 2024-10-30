const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
router.get('/test', (req, res) => {
    res.render('events/test.ejs'); // This should render the test.ejs file
});

router.get('/Event', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('events/events.ejs', { events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
