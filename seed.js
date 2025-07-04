const mongoose = require('mongoose');
const Event = require('./models/Event'); // Adjust the path as necessary

mongoose.connect('mongodb+srv://vibhu:vibhu1234@swipe2clean.xsecvro.mongodb.net/database')
    .then(() => {
        console.log('MongoDB connected for seeding data.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const seedEvents = async () => {
    try {
        await Event.deleteMany({}); // Clear existing data if needed
        const events = [
            {
                name: 'Event 1',
                date: '2024-10-30',
                location: 'Location 1',
                description: 'Description for Event 1',
                venue: 'Venue 1',
                price: 100
            },
            {
                name: 'Event 2',
                date: '2024-10-31',
                location: 'Location 2',
                description: 'Description for Event 2',
                venue: 'Venue 2',
                price: 150
            },
            // Add more dummy events as needed
        ];
        await Event.insertMany(events);
        console.log('Database seeded with dummy events.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close(); // Close the connection after seeding
    }
};

seedEvents();
