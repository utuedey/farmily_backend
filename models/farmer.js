const mongoose = require('mongoose');

// Create a mongoose schema for the Farmer profile

const farmerSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: String,
    profilePicture: String,
    farmLocation: String,
    farmProduces: String,
});

module.exports = mongoose.model('Farmer', farmerSchema);