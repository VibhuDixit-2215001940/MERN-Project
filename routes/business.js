const express = require('express');
const router = express.Router();
const BusinessUser = require('../models/BusinessUser');
// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).send('Unauthorized');
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
        res.redirect('/BusinessLogin'); // Redirect to login after signup
    } catch (err) {
        res.status(500).send('Error signing up: ' + err.message);
    }
});
router.post('/loginn', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await BusinessUser.findOne({ username: userName });
        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id; // Store user session
            res.redirect('/Business');
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (err) {
        res.status(500).send('Error logging in: ' + err.message);
    }
});
router.get('/BusinessProfile',ensureAuthenticated,async (req, res) => {
    // res.render('Business/profile.ejs'); 
    try {
        const userId = req.user.id; // Get user ID from the session
        const userProfile = await BusinessUser.findById(userId);
    
        if (!userProfile) {
          return res.status(404).send('Profile not found');
        }
    
        res.render('Business/profile.ejs', {
          user: userProfile, // Pass user data to the EJS template
          purchases: userProfile.purchases,
          sales: userProfile.sales,
          profit: userProfile.profit
        });
      } catch (error) {
        res.status(500).send('Server error',error);
      }
})
// Dummy functions for illustration, replace with actual implementation
async function getUserPurchases(userId) {
    // Logic to fetch the number of purchases for the user
    return 10; // Replace with actual data
}

async function getUserSales(userId) {
    // Logic to fetch the number of sales for the user
    return 5; // Replace with actual data
}

async function getUserProfit(userId) {
    // Logic to fetch the profit for the user
    return 200; // Replace with actual data
}
module.exports = router;
