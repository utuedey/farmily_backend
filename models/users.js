const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const UserModel = new mongoose.Schema({
    username: String,
    password: String
})

// Automatically handles hashing and salting of passwords
// and adds the following properties to the user objects
UserModel.plugin(passportLocalMongoose)

module.exports = mongoose.model('users', UserModel)