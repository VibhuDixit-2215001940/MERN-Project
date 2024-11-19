const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }, 
    venue: { type: String, required: true },       
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
