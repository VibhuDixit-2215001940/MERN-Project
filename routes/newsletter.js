const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// POST /subscribe — Save email to MongoDB
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            if (existing.active) {
                return res.status(200).json({ message: 'You are already subscribed! ✅' });
            } else {
                // Re-activate
                existing.active = true;
                await existing.save();
                return res.status(200).json({ message: 'Welcome back! Your subscription has been reactivated. ✅' });
            }
        }

        // Save new subscriber
        const subscriber = new Subscriber({ email: email.toLowerCase().trim() });
        await subscriber.save();

        console.log('New subscriber:', email);
        res.status(201).json({ message: 'Thank you for subscribing! ✅' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});

// GET /unsubscribe — Unsubscribe
router.get('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.send('Invalid unsubscribe link.');

        await Subscriber.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { active: false }
        );
        res.send('<h2>You have been unsubscribed from Swipe2Clean notifications.</h2><p>We are sorry to see you go! 😢</p>');
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.send('Something went wrong. Please try again.');
    }
});

module.exports = router;
