const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const mongoose = require('mongoose');

// [0] Test funktion
router.get('/', async (req, res) => {
    console.log('Denne funktion triggers');
    res.send('Hej - jeg går klart igennem ruten "https://localhost:3443/client')
});

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
router.post('/:firstName/:lastName/:street_address/:city', async (req, res) => {
    /* Ud fra URL'en, så henter systemet de enkelte dele, altså firstName, lastName, osv og ud fra disse værdier,
    vil der oprettes en bruger. */
    const client = new Client({
        // Parameterne i URL'en opfanges ved "req.params"
        _id: new mongoose.Types.ObjectId(),
        firstName: req.params.firstName,
        lastName: req.params.lastName,
        street_address: req.params.street_address,
        city: req.params.city
    });
    // Den oprettet en cilent med de ovenstående værdier
    client
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Bruger oprettet",
                createdClient: result
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

// [3] Læs specifick kundes oplysninger
router.get('/:id', async (req, res) => {
    try {
        const clients = await Client.findById(req.params.id);
        res.end("This is the endpoint for: " + "\n" + clients)
    } catch (err) {
        console.log({ message: err })
    };
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
            res.send("Følgende bruger er blevet opdateret: \n" + client);
        });
    });
});

// [5] Sletter kunde med specifikt id fra database
router.delete('/:id', function (req, res, next) {
    // Client referer til Client model (mongoose model)
    mongoose.set('useFindAndModify', false);
    Client.findByIdAndRemove({_id: req.params.id}).then((function(client){
        res.send("Følgende bruger er blevet slettet: \n" + client);
    }));
});

module.exports = router;



