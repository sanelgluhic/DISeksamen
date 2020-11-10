const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Jeg laver et "account" skema
const AccountSchema = new mongoose.Schema({

    // Alle som strings, udover "id"
    _id: mongoose.Schema.Types.ObjectId,

    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    alias: {
        type: String,
        required: false,
    }
});
const model = mongoose.model('Account', AccountSchema);
module.exports = model;