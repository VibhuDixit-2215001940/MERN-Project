const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/leaderboard', async function(req, res) {
    try {
        const userinfo = await User.findById(req.session.userId);
        const users = await User.find({}).sort({ complaintCount: -1 });
        if (!userinfo) {
            return res.status(404).send('User not found');
        }
        const totalComplaints = userinfo.complaintsCount; // Get the total number of complaints
        const points = totalComplaints * 10; // Points: 10 points per complaint
        const eRupees = totalComplaints * 100; // E-Rupees: 100 INR per complaint
        res.render('leaderboard/leaderboard.ejs', {
            user: userinfo,
            totalComplaints,
            points,
            eRupees,
            users
        });
    } catch (error) {
        console.error(error);
        res.redirect('/Err');
    }
});
module.exports = router;