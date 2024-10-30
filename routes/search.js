// Import required packages and models
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Search posts route
router.get('/search', async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const posts = await Post.find({
            content: { $regex: searchTerm, $options: 'i' } // Case-insensitive search on content
        }).populate('userId', 'userName'); // Populate user details if needed

        res.json(posts); // Send the matched posts as JSON
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
