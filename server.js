#!/usr/bin env node

const express = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bycrpt = require('bcrypt');

const app = express();

// Express middleware for parsing JSON requests.
app.use(express.json());

// Express session middleware
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));


// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Dummy user database
const users = [{ id: 1, username: 'user1', password: '$2b$10$rcMwT...' }];

// Passport local strategy configuration
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username);
        if (!user){
            return done(null, false, {message: 'Incorrect username.'});
        }
        bycrpt.compare(password, user.password, (err, res) => {
            if (res){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Incorrect password'});
            }
        });
    }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) =>{
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Routes
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login-failure'}),
    (req, res) => {
    res.redirect('/dashboard'); // Redirect on successful login
});

app.get('/dashboard', 
    isAuthenticated,
    (req, res) => {
    res.send(`Welcome, ${req.user.username}!`)
}
);

app.get('/login-failure', (req, res) => {
    res.send('Login failed. Please try again.');
});

// Custom middleware to check if the user is authenticated
function isAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
