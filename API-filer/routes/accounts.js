const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const objectId = require('mongoose').Types.ObjectId;

const Account = require('../models/accounts');
const Client = require('../models/clients');

// [1] Hent alle eksisterende accounts
router.get('/', async (req, res) => {
    try {
        // 1. return accounts from database instead
        return res.json(await Account.find({})
            .exec());
    } catch (err) {
        console.log({ message: err.message })
    }
});

// [2] Opretter en ny konto til en client
router.post('/:client_id/:balance', async (req, res) => {
    /* Ud fra URL'en, så henter systemet de enkelte dele, (client_id og balance). Ud fra disse værdier så
    oprettes der et account til den specifikke bruger */
    const account = new Account({
        // Parameterne i URL'en opfanges ved "req.params"
        _id: new mongoose.Types.ObjectId(),
        client_id: req.params.client_id,
        balance: req.params.balance,
        alias: '',
    });
    // Den oprettet en account til en client med de ovenstående værdier
    account
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Account til følgende client_Id " + req.params.client_id + " er oprettet",
                createdAccount: result
            });
        })
        // Hvis oprettelsen IKKE lykedes, catcher vi fejlen
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: 'Fejl i oprettelsen'
            });
        });
});

// [3] Retunere en specifik konto
router.get('/:id', async (req, res) => {
    try {
        const accounts = await Account.findById(req.params.id);
        res.end("Følgende konto tilfører det specificerede id: " + "\n" + accounts)
    } catch (err) {
        console.log({ message: err })
    };
});

// [4] Ændrer en kontos balance
router.put('/:id', function (req, res, next) {
    /* */
    mongoose.set('useFindAndModify', false);
    Account.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(account){
        Account.findOne({_id: req.params.id}).then(function(account){
            res.send("Følgende accounts balance er blevet opdateret: \n" + account);
        });
    });
});

// [5] Sletter en konto med det specifikke ID
router.delete('/:id', function (req, res, next) {
    // Account referer til Account model (mongoose model)
    mongoose.set('useFindAndModify', false);
    Account.findByIdAndRemove({_id: req.params.id}).then((function(account){
        res.send("Følgende account er blevet slettet: \n" + account);
    }));
});

// [6] Retunere en specifik kontos balance
router.get('/:id/balance', async (req, res) => {
    Account.findById({_id: req.params.id})
        .then(account => {
            res.status(200).json({
                balance: account.balance
            });
    });
});

// [7] Overfør penge fra en konto til en anden konto
router.get('/transfer', async (req, res) => {};


module.exports = router;