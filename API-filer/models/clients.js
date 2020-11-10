const mongoose = require('mongoose');

// Jeg laver et "client" skema
const ClientSchema = new mongoose.Schema({
    // Alle som strings, udover "id"
        _id: mongoose.Schema.Types.ObjectId,

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

const model = mongoose.model('Client', ClientSchema);

module.exports = model;