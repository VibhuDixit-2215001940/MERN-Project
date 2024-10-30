// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fname: { type: String },
    lname: { type: String },
    password: { type: String, required: true },
    lastLogin: { type: Date }, 
    image: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    complaintsCount: { type: Number, default: 0 }, 
    pointsEarned: { type: Number, default: 0 }, 
    eRupees: { type: Number, default: 0 } 
});

module.exports = mongoose.model('User', userSchema);
