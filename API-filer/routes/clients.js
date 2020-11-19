// Her requires noget forskelligt
const express = require('express');
const router = express.Router();
const Client = require('../models/clients');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false); // Ellers kommer der fejl op

// [1] Hent alle eksisterende kunder
router.get('/', async (req, res) => {
    try {
        // Finder og retunerer alle clients fra databasen
        return res.json(await Client.find({})
        .exec());
    } catch (err) {
        console.log({ message: err.message })
    }
});

// [2] Opret ny kunde
router.post('/', async (req, res) => {
    // Et unikt _id oprettes til en ny client
    const _id = new mongoose.Types.ObjectId;
    req.body._id = _id;

    /* De enkelte parametre hentes ud fra body'et som sendes med i requestet.
    Parametrene bruges til oprettelse af en ny bruger */
    Client.create(req.body).then(function(client){
        // instans af client-objekt oprettes og sendes til klient
        res.send(client);
    })
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
    // _id'et hentes og defineres som en variabel fra body'et
    const id = req.params.id;
    // finder den specefikke client i databasen ud fra id'et
    Client.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                // client-instansen sendes retur med statuskode 200
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
router.put('/:id', async (req, res) => {
    // Ud fra body'et opdateres feltet/felterne i client-documentet, i databasen, med nye værdier
    Client.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(client){
        // Den opdaterede client retuneres
        Client.findOne({_id: req.params.id}).then(function(client){
            res.send(client);
        });
    });
});

// [5] Sletter kunde med specifikt id fra database
router.delete('/:id', async (req, res) => {
    // Client findes i databasen på baggrund af id'et som sendes i body'et og derefter slettes clienten i databasen
    Client.findByIdAndRemove({_id: req.params.id})
        .then((function(client){
            // Statuskode 200 og den slettede client sendes til klient
        res.status(200);
        res.send(client);
    }));
});

module.exports = router;



