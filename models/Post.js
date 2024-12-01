const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    content: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
    image: { type: String }, 
    likes: { type: Number, default: 0 }, 
    comments: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
            comment: { type: String, required: true }, 
            createdAt: { type: Date, default: Date.now } 
        }
    ],
    shares: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Post', postSchema);
