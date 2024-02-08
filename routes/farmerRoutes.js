//  File contains all the routes for the farmers api

const express = require('express');
const Farmer = require('../models/farmer')

const FarmerRoute = express.Router();

// Route to create a farmer's profile
FarmerRoute.post('/api/farmers', async (req, res) => {
    try {
        const newFarmer = await Farmer.create(req, res);
        res.json(newFarmer);
    } catch (error) {
        res.status(500).json({ error: 'Error creating farmer profile'});
    }
});

// Route to get all farmers
FarmerRoute.get('/api/farmers', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching farmers'});
    }
});

// Route to update farm produces for a specific farmer
FarmerRoute.put('/api/farmers/:id/farm-produces', async (req, res) => {
    const { id } = req.params;
    const { farmProduces }  = req.body;

    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(id,
            {farmProduces }, {new: true});
        
        if (!updatedFarmer) {
            return res.status(404).json({error: 'Farmer not found'});
        }

        res.json(updatedFarmer);
    } catch (error) {
        res.status(500).json({ error: 'Error updating farm produces'})
    }
});

module.exports = FarmerRoute;