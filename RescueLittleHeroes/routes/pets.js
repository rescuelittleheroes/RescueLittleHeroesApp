const express = require('express');
const router = express.Router();
const Pet = require("../models/Pets")
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/list', (req, res, next) => {
    Pet.find()
        .then(pets => {
            res.render("list", { pets })
        }).catch((err) => {
            console.log(err)
        });
});

router.get('/add', (req, res, next) => {
    res.render("add")
});

router.post('/add', uploadCloud.single('photo'), (req, res, next) => {
    Pet
        .create({
            shelter: "Shelter1",
            name: String,
            type_animal: "Dog",
            size: "Small",
            wasFounded: false,
            description: "Encontrado pequeño caniche blanco",
            photo_name: "original name", //req.file.originalname,
            photo_url: "https://www.hogarmania.com/archivos/201705/mascotas-perros-razas-caniche-668x400x80xX.jpg", //req.file.url,
            location: ["40.3885195", "-3.6695838"],
            neighborhood: ["Puente Vallecas"],
            founded_by: req.user.id
        })
        .then(newPet => res.redirect("/pet/list"))
        .catch((err) => {
            console.log(err)
        })
});

router.get('/detail/:id', (req, res, next) => {
    Pet.findOne({ _id: req.params.id })
        .then(pet => {
            res.render("detail", { pet })
        }).catch((err) => {
            console.log(err)
        });

});

router.post('/:id/delete', (req, res, next) => {
    Pet.findByIdAndRemove({ _id: req.params.id })
        .then(petDelete => res.redirect("/"))
        .catch((err) => {
            console.log(err)
        });
});
router.get('/edit/:id', (req, res, next) => {
    Pet.findOne({ _id: req.params.id })
        .then(pet => {
            res.render("edit", { pet })
        }).catch((err) => {
            console.log(err)
        });

});
router.post("/edit-place", (req, res) => {
    Pet
        .findByIdAndUpdate(req.body._id, {
            shelter: "Shelter1",
            name: String,
            type_animal: "Dog",
            size: "Small",
            wasFounded: false,
            description: "Encontrado pequeño caniche blanco",
            photo_name: "original name", //req.file.originalname,
            photo_url: "https://www.hogarmania.com/archivos/201705/mascotas-perros-razas-caniche-668x400x80xX.jpg", //req.file.url,
            location: {
                type: 'Point',
                coordinates: [+req.body.longitude, +req.body.latitude]
            },
            neighborhood: ["Puente Vallecas"],
            founded_by: req.user.id
        })
        .then(updatedPet => {
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err)
        });
})

router.get('/json', (req, res, next) => {
    Place.find().then(pets => {
        res.json({ pets })
    }).catch((err) => {
        console.log(err)
    });
});

module.exports = router;