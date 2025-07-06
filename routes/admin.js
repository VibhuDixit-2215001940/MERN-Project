const express = require('express');
const router = express.Router();
const session = require('express-session');
const Event = require('../models/Event');
const User = require('../models/User'); 
const Complain = require('../models/Complain'); 
const BusinessUser = require('../models/BusinessUser');
const { v4: uuidv4 } = require('uuid');

function generateShortId() {
    return uuidv4().split('-').join('').slice(0, 8); // Take first 8 characters of the UUID without dashes
}

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
        const businessUsers = await BusinessUser.find();
        const searchQuery = req.query.search || ""; 
        const complaints = await Complain.find({
            address: { $regex: searchQuery, $options: 'i' }
        });
        const complaintDetails = complaints.map(complaint => {
            const timeElapsed = Date.now() - complaint.createdAt; 
            let status;
            if (timeElapsed < 12 * 60 * 60 * 1000) { 
                status = "Ongoing";
            } else if (timeElapsed < 24 * 60 * 60 * 1000) { 
                status = "Action Taken";
            } else { // More than 24 hours
                status = "Action Pending";
            }
            return {
                id: generateShortId(),
                wasteType: complaint.wastetype || "Not specified",
                location: (complaint.address || "Not specified").slice(0, 40),
                status: status
            };
        });
        const userData = {
            name: req.session.userId,
            lastLogin: new Date().toLocaleString(),
        };
        res.render('Admin/index.ejs', {
            activeComplaints: complainCount, 
            activeusers: userCount,
            activeBiddings: businessCount, 
            activeEvents: eventCount, 
            user: userData,
            businessUsers: businessUsers,
            complaints: complaintDetails,
            generateShortId: generateShortId
        });
    } catch (error) {
        console.error(error);
        // res.status(500).send('Server error');
        res.redirect('/Err');
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
