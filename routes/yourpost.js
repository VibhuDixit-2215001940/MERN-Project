const express = require('express');
const router = express.Router();
const User = require('../models/User');//For accessing data from the db

router.get('/YourPost', function(req, res) {
    res.render('home/index');
})

module.exports = router;