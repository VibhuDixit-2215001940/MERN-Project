const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const YourPostRoutes = require('./routes/yourpost');
const eventsRoutes = require('./routes/events');
const walletRoutes = require('./routes/wallet');
const complainRoutes = require('./routes/complain');
const leaderboardRoutes = require('./routes/leaderboard');
const postRoutes = require('./routes/search');
const businessRoutes = require('./routes/business');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');
const sanitizationRoutes = require('./routes/sanitization');
const desposalRoutes = require('./routes/desposal');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');
app.use(cors());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vibhu:vibhu1234@swipe2clean.xsecvro.mongodb.net/database', {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://vibhu:vibhu1234@swipe2clean.xsecvro.mongodb.net/database',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // important for Render.com
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

app.use('/posts', postRoutes);
app.use('/home', loginRoutes);
app.use(loginRoutes);
app.use(YourPostRoutes);
app.use(eventsRoutes);
app.use('/events', eventsRoutes);
app.use(walletRoutes);
app.use('/wallet', walletRoutes);
app.use(complainRoutes)
app.use('/compalin', complainRoutes);
app.use(leaderboardRoutes)
app.use('/leaderboard', leaderboardRoutes)
app.use(businessRoutes)
app.use(adminRoutes)
app.use(feedbackRoutes)
app.use(sanitizationRoutes)
app.use(desposalRoutes)

app.get('/', (req, res) => {
    res.render('home/index');
});

app.get('*', (req, res) => {
    res.render('404/index');
});
app.get('/Err', (req, res) => {
    res.render('404/index');
});
// app.listen(8000, () => {
//     console.log("Listening at port 8000!");
// });
app.listen(8000, '0.0.0.0', () => {
    console.log("Server running on port 8000");
});
