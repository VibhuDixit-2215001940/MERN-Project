// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
    content: { type: String, required: true }, // Text content of the post
    createdAt: { type: Date, default: Date.now }, // Date of creation
    image: { type: String } // Path to an image if the post has one
});

module.exports = mongoose.model('Post', postSchema);
