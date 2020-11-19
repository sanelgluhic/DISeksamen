const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Aaccount skema oprettes
const AccountSchema = new mongoose.Schema({
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