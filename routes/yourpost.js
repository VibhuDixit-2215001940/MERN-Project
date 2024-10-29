const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const multer = require('multer');
const Post = require('../models/Post');
const path = require('path');
// const ensureAuthenticated = require('../middleware/auth'); // Ensure this path is correct

//-------------------------------------------MIDDLEWARE--------------------------------
function ensureAuthenticated(req, res, next) {// Middleware to ensure the user is authenticated
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}
//-------------------------------------------REDERING YOURPOST PAGE--------------------------------
router.get('/YourPost', function(req, res) {
    res.render('home/index');
});
// router.get('/Profile', ensureAuthenticated, async function(req, res) {
//     const user = await User.findById(req.session.userId); // Use userId from session// Access the userId from session to find the user
//     if (!user) {
//         return res.status(404).send('User not found'); // Handle case if user is not found
//     }
//     req.session.userName = user.fname;
//     res.render('YourPost/profile', { user });
// });
router.get('/Profile', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).lean(); // Use session user ID
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        const posts = await Post.find({ userId: user._id }).lean(); // Fetch posts by user ID

        // Attach posts to user
        user.posts = posts;

        // Render profile view and pass user with posts
        res.render('YourPost/profile', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//------------------------------------------------EDIT PROFILE-------------------------------------------------------------------
// GET route to render the edit form
router.get('/Profile/edit', ensureAuthenticated, async function(req, res) {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('YourPost/editProfile', { user });
});



//----------------------------------------IMAGE UPLOAD---------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the upload folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // append timestamp to filename
    }
});

const upload = multer({ storage: storage });

// Route to edit user profile
// POST route to handle form submission
router.post('/Profile/edit', ensureAuthenticated, upload.single('profileImage'), async function(req, res) {
    const { fname, lname, email } = req.body;
    const updatedData = { fname, lname, email };

    // Check if a file was uploaded and update the image path
    if (req.file) {
        updatedData.image = `/uploads/${req.file.filename}`; // Save the path to the database
    }

    await User.findByIdAndUpdate(req.session.userId, updatedData);
    res.redirect('/Profile');
});
//----------------------------------------CREATE POST --------------------------------
router.get('/CreatePost', async (req, res) => {
    const userinfo = await User.findById(req.session.userId);
    if (userinfo) { // Make sure req.user exists
        res.render('YourPost/createPost', { user: userinfo });
    } else {
        // Redirect to login or handle unauthenticated users
        res.redirect('/login');
    }
});
router.post('/CreatePost', ensureAuthenticated, upload.single('image'), async (req, res) => {
    const { content } = req.body; 
    const userId = req.session.userId;
    const image = req.file ? req.file.path : null; // Get the image path if uploaded

    const newPost = new Post({
        userId,
        content,
        image, // Save the image path in the post model
        createdAt: Date.now()
    });

    try {
        await newPost.save();
        res.redirect('/YourPost');
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).send("An error occurred while saving the post");
    }
});



module.exports = router;
