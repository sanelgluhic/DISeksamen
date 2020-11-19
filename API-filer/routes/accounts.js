const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);  // Ellers kommer der fejl op

const Account = require('../models/accounts');
const Client = require('../models/clients');

// [5] Overfører penge fra en konto til en anden
router.put('/transfer', async (req, res, next) => {
    //[7] Overfører penge fra en konto til en anden
        const amount = parseInt(req.body.amount);
        const fromAccount = await Account.findOneAndUpdate({ _id: req.body.fromAccount },{
            $inc: { balance : -amount }
        },{useFindAndModify:false}).exec();
        const toAccount = await Account.findOneAndUpdate({ _id: req.body.toAccount }, {
            $inc: { balance : amount }
        }, {useFindAndModify:false}).exec();
        res.status(200).json('transfered ' + amount + ' to ' + toAccount.alias + ' from ' + fromAccount.alias)
    });

// [4] Ændrer en kontos balance
router.put('/:id', async (req, res, next) => {
    // $set medfører at balancen i den fundne account sættes til at være det, som sendes med i body'et
    Account.findByIdAndUpdate({_id: req.params.id}, {$set : {balance : req.body.balance, alias: req.body.alias }}).then(function(account){
        Account.findOne({_id: req.params.id}).then(function(account){
            res.status(200).json(account);
        })
    });
});

// [1] Hent alle eksisterende accounts
router.get('/', async (req, res) => {
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
    const id = req.params.id;
    Account.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
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



    /*
    // $set medfører at balancen i den fundne account sættes til at være det, som sendes med i body'et
    const id = req.params.id;
    Account.findByIdAndUpdate(id, {$set : {"balance" : req.body.balance}})
        .exec()
        .then(doc =>{
                res.status(200);
                doc.update(doc.balance);
                console.log(doc.balance);
                res.send(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
     */

/*
    Account.findByIdAndUpdate(id, {$set : {"balance" : req.body.balance}})
        .then(function(){Account.findOne({_id: req.params.id})
            .then(function(account) {res.status(200).json(account)})
    });
});

 */


// [7] Retunere en specifik kontos balance
router.get('/:id/balance', async (req, res) => {
    Account.findById({_id: req.params.id})
        .then(account => {
            res.status(200).json({
                balance: account.balance
            });
        });
});


// [6] Sletter en konto med det specifikke ID
router.delete('/:id', function (req, res, next) {
    // Account referer til Account model (mongoose model)
    mongoose.set('useFindAndModify', false);
    Account.findByIdAndRemove({_id: req.params.id}).then((function(account){
        res.status(200);
        res.send(account);
    }));
});





module.exports = router;