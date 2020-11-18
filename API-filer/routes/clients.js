const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const mongoose = require('mongoose');

// [1] Hent alle eksisterende kunder
router.get('/', async (req, res) => {
    try {
        // 1. return accounts from database instead
        return res.json(await Client.find({})
        .exec());
    } catch (err) {
        console.log({ message: err.message })
    }
});

// [2] Opret ny kunde
router.post('/', async (req, res) => {
    // For IKKE at skulle sende et ID med i body'en, så oprettes der et ID til en client
    const _id = new mongoose.Types.ObjectId;
    req.body._id = _id;

    // Ud fra bodyen'en, så henter systemet de enkelte parametre, som skal bruges til oprettelse af en bruger
    Client.create(req.body).then(function(client){
        res.send(client); // Opretter en ny instans af et client-objekt og sender det til klienten
    })
        // Hvis oprettelsen af klienten ikke lykkedes, catcher vi fejlen
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: 'Fejl i oprettelsen'
            });
        });
});

// [3] Læs specifick kundes oplysninger
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    Client.findById(id)
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

// [4] Opdater en eksisterende kundes oplysninger
router.put('/:id', function (req, res, next) {
    /* Måden hvorpå denne funktion fungerer, er ved at der via postman sendes et "body" afsted med det, som man
    ønsker at opdatere. Herefter vil den enkelte del som sendes, blive opdateret i databasen. Selve
    funktionen vil retunere det opdaterede objekt */

    /* findByIdAndUpdate finder brugeren i databasen og opdatere dens oplysninger. Selve funktionen indtager
    et "id" som parameter. Her specificeres den ønskede id som skal opdateres.
    "req.body" angiver det body som
    opdatere den eksisterende information i databasen */
    Client.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(client){
        Client.findOne({_id: req.params.id}).then(function(client){
            res.send(client);
        });
    });
});

// [5] Sletter kunde med specifikt id fra database
router.delete('/:id', function (req, res, next) {
    // Client referer til Client model (mongoose model)
    mongoose.set('useFindAndModify', false);
    Client.findByIdAndRemove({_id: req.params.id})
        .then((function(client){
        res.status(200);
        res.send(client);
    }));
});

module.exports = router;



