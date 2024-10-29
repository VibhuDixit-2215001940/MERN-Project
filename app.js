const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const YourPostRoutes = require('./routes/yourpost');

app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)
app.set('view engine','ejs');//Iska simple yahi kaam hai ki ejs file ko read kare
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/swipe2clean', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: false }));
app.use(session({
     secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
}));

app.use('/home', loginRoutes);

app.use(loginRoutes)
app.use(YourPostRoutes)
app.get('/', (req, res) => {
    res.render('home/index')
})
app.get('*',(req,res)=>{
    res.send("Hello u are here at swipe2clean mern project!!")
})
app.listen(8000,()=>{
    console.log("listening at 8000 port!!")
})