const express = require('express');
const router = express.Router();
const Shelter = require("../models/Shelter")
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('animalShelters');
});

router.get('/list', (req, res, next) => {
    Shelter.find()
        .then(shelters => {
            res.render("animalShelters", { shelters })
        }).catch((err) => {
            console.log(err)
        });
});

router.get('/add', (req, res, next) => {
    res.render("add")
});

router.post('/add', uploadCloud.single('photo'), (req, res, next) => {
    Shelter
        .create({
            name: "ShelterName",
            address: "ShelterAddress",
            location: {
                type: 'Point',
                coordinates: [+req.body.longitude, +req.body.latitude]
            },
            phone: "789654321",
            email: "email@gmail.com",
        })
        .then(newShelter => res.redirect("/shelter/list"))
        .catch((err) => {
            console.log(err)
        })
});

router.get('/detail/:id', (req, res, next) => {
    Shelter.findOne({ _id: req.params.id })
        .then(shelter => {
            res.render("detail", { pet })
        }).catch((err) => {
            console.log(err)
        });

});

router.post('/:id/delete', (req, res, next) => {
    Shelter.findByIdAndRemove({ _id: req.params.id })
        .then(shelterDelete => res.redirect("/"))
        .catch((err) => {
            console.log(err)
        });
});
router.get('/edit/:id', (req, res, next) => {
    // Shelter.findOne({ _id: req.params.id })
    //     .then(shelter => {
    //         res.render("shelters-edit", { shelter })
    //     }).catch((err) => {
    //         console.log(err)
    //     });
res.render("shelters-edit");
});
router.post("/edit-place", (req, res) => {
    Shelter
        .findByIdAndUpdate(req.body._id, {
            name: "ShelterName",
            address: "ShelterAddress",
            location: {
                type: 'Point',
                coordinates: ["40.3885195", "-3.6695838"]
            },
            phone: "789654321",
            email: "email@gmail.com",
        })
        .then(updatedPet => {
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err)
        });
})

router.get('/json', (req, res, next) => {
    Shelter.find().then(shelters => {
        res.json({ shelters })
    }).catch((err) => {
        console.log(err)
    });
});

module.exports = router;