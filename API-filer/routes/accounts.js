// Her requires noget forskelligt
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/accounts');

mongoose.set('useFindAndModify', false);  // Ellers kommer der fejl op

// [7] Overfører penge fra en konto til en anden (skal stå øverst ellers virker testen ikke)
router.put('/transfer', async (req, res) => {
        // amount sendt med body'et defineres som en variabel
        const amount = parseInt(req.body.amount);

        // fromAccount findes i database og fratrækkes "amount" i feltet "balance"
        const fromAccount = await Account.findOneAndUpdate({ _id: req.body.fromAccount },
            {$inc: { balance : -amount }}).exec();

        // toAccount findes i database og tilføres "amount" i feltet "balance"
        const toAccount = await Account.findOneAndUpdate({ _id: req.body.toAccount },
            {$inc: { balance : amount }}).exec();

        // Retunere hvilken konto der er fratrukket "amount" og tilført "amount"
        res.status(200).json('transfered ' + amount + ' to ' + toAccount.alias + ' from ' + fromAccount.alias)
    });

// [1] Hent alle eksisterende accounts
router.get('/', async (req, res) => {
    // Finder og retunerer alle clients fra databasen
    Account.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// [2] Opretter en ny konto til en client
router.post('/', async (req, res) => {
         // Et unikt _id oprettes til en ny account
        const _id = new mongoose.Types.ObjectId;
        req.body._id = _id;

        /* De enkelte parametre hentes ud fra body'et som sendes med i requestet.
        Parametrene bruges til oprettelse af en ny account */
        Account.create(req.body).then(function(account){
            // // instans af account-objekt oprettes og sendes til klient
            res.send(account);
        })
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
    // _id'et hentes og defineres som en variabel fra body'et
    const id = req.params.id;
    // finder den specefikke account i databasen ud fra id'et
    Account.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                // account-instansen sendes retur med statuskode 200
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: " " });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// [4] Ændrer en kontos balance
router.put('/:id', async (req, res) => {
    // Ud fra body'et opdateres felterne "balance" og "alias" i account-documentet, i databasen, med nye værdier
    Account.findByIdAndUpdate({_id: req.params.id}, {$set : {balance : req.body.balance, alias: req.body.alias}})
        .then(function(account){Account.findOne({_id: req.params.id}).then(function(account){
            // Den opdaterede account retuneres med statuskode 200
            res.status(200).json(account);
        })
    });
});

// [5] Sletter en konto med det specifikke ID
router.delete('/:id', async (req, res) => {
    // Account findes i databasen på baggrund af id'et som sendes i body'et og derefter slettes accounten i databasen
    mongoose.set('useFindAndModify', false);
    Account.findByIdAndRemove({_id: req.params.id}).then((function(account){
        // Statuskode 200 og den slettede account sendes til klient
        res.status(200);
        res.send(account);
    }));
});

// [6] Retunere en specifik kontos balance
router.get('/:id/balance', async (req, res) => {
    // Account findes i databasen på baggrund af id'et som sendes i body'et
    Account.findById({_id: req.params.id})
        .then(account => {
            // Den fundene accounts balance retuneres
            res.status(200).json({
                balance: account.balance
            });
        });
});


module.exports = router;