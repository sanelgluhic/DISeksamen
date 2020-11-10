const mongoose = require('mongoose');

// Jeg laver et "account" skema, som definere hvordan en account gemmes i min database
const AccountSchema = new mongoose.Schema({

    // Alle som strings, udover "id"
    id: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    street_address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    }
});

const model = mongoose.model('Account', AccountSchema);

module.exports = model;