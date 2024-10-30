const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }, // Ensure this is included
    venue: { type: String, required: true },       // Ensure this is included
    price: { type: Number, required: true }        // Ensure this is included
    // Add other fields as needed
});

module.exports = mongoose.model('Event', eventSchema);
