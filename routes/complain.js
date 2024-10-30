const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Complain = require('../models/Complain'); // Adjust the path based on your project structure
const multer = require('multer');
const path = require('path');
router.get('/Complain', async function(req, res) {
    try {
        const userinfo = await User.findById(req.session.userId);
        if (!userinfo) {
            return res.status(404).send('User not found');
        }
        const totalComplaints = userinfo.complaintsCount; // Get the total number of complaints
        const points = totalComplaints * 10; // Points: 10 points per complaint
        const eRupees = totalComplaints * 100; // E-Rupees: 100 INR per complaint
        res.render('complain/complain.ejs', {
            user: userinfo,
            totalComplaints,
            points,
            eRupees
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
const storage = multer.diskStorage({
    destination: './uploads/', // Directory to save uploaded images
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024} // Limit file size to 1MB
}).single('garbage');

// POST route for submitting complaints
router.post('/YourPost', upload, async (req, res) => {
    try {
        const complain = new Complain({
            user: req.session.userId, // Use session user ID if not authenticated
            wastetype: req.body.wastetype,
            comment: req.body.comment,
            phoneno: req.body.phoneno,
            email: req.body.email,
            address: req.body.address,
            image: req.file.path // Ensure req.file is defined
        });

        await complain.save();
        res.redirect('/YourPost');
    } catch (err) {
        console.error('Error while saving complain:', err); // Log specific error
        res.status(500).send('Server Error');
    }
});


module.exports = router;