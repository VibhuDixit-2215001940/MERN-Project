const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Complain = require('../models/Complain');
const multer = require('multer');
const path = require('path');
router.get('/Complain', async function(req, res) {
    try {
        const userinfo = await User.findById(req.session.userId);
        if (!userinfo) {
            return res.status(404).send('User not found');
        }
        const totalComplaints = userinfo.complaintsCount; 
        const points = totalComplaints * 10; 
        const eRupees = totalComplaints * 100; 
        res.render('complain/complain.ejs', {
            user: userinfo,
            totalComplaints,
            points,
            eRupees
        });
    } catch (error) {
        console.error(error);
        res.redirect('/Err');
    }
});
const storage = multer.diskStorage({
    destination: './uploads/', 
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024} 
}).single('garbage');
module.exports = router;