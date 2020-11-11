const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
router.post('/', async (req, res) => {
        // For IKKE at skulle sende et ID med i body'en, så oprettes der et ID til en konto
        const _id = new mongoose.Types.ObjectId;
        req.body._id = _id;

        // Ud fra bodyen'en, så henter systemet de enkelte parametre, som skal bruges til oprettelse af en konto
        Account.create(req.body).then(function(account){
            res.send(account); // Opretter en ny instans af et account-objekt og sender det til klienten
        })
            // Hvis oprettelsen af konto ikke lykkedes, catcher vi fejlen
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
    }
});

// [4] Ændrer en kontos balance
router.put('/:id', function (req, res, next) {
    // $set medfører at balancen i den fundne account sættes til at være det, som sendes med i body'et
    Account.findByIdAndUpdate({_id: req.params.id}, {$set : {"balance" : req.body.balance}}).then(function(account){
        Account.findOne({_id: req.params.id}).then(function(account){
            res.send("Account updated \n" + account);
        })
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



module.exports = router;