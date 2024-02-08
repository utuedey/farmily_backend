#!/usr/bin env node

const express = require('express');
const passport = require('passport')
const session = require('express-session');
const mongoose = require('mongoose')
const connectEnsureLogin = require('connect-ensure-login');
const bodyParser = require('body-parser');
const userModel = require('./models/users');
const FarmerRoute = require('./routes/farmerRoutes')

require('dotenv').config();

const PORT = 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// express app instance
const app = express();

// Express middleware for parsing JSON requests.
app.use(express.json());

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*1000} // 1 hour
}));

// Passport Initialization
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());  // use the user model to create the strategy

// Serialize and deserialize the user object to and from session.
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.set('views', 'views');
app.set('view engine', 'ejs');


// render market page
app.get('/market', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('market');
});
// renders the homepage
app.get('/', (req, res) => {
    res.render('index');
});

// renders the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// renders the signup
app.get('/signup', (req, res) => {
    res.render('signup');
});

// handles farmers api routes
app.use('/api/farmers', FarmerRoute)

// handles the signup request of new users
app.post('/signup', (req, res) => {
    const user = req.body;
    userModel.register(new userModel({ username: user.username }),
     user.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(400).send(err)
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/login');
    }); 
   }})
})

// Handles the login request for exisiting users
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}),
     (req, res) => { res.redirect('market')
})

// Handles the logout request
app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// catch error middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("something broke!");
})

// connect to the database using mongoose
mongoose
.connect(MONGODB_URL)
.then(() => {
    // The express server should only run when the database is connected
    console.log("App connected to database")
    app.listen(PORT, function() {
        console.log(`App is listening to port ${PORT}`)
    });

})
.catch((error) => {
    console.log(error);
});
