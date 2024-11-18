const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const posts = await Post.find({
            content: { $regex: searchTerm, $options: 'i' } 
        }).populate('userId', 'userName'); 

        res.json(posts); 
    } 
    catch (err) {
        res.redirect('/Err');
    }
});

module.exports = router;
