const express = require('express');
const router = express.Router();
const Pet = require("../models/Pets")
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
// router.get('/', (req, res, next) => {
//     res.render('lostPets');
// });

router.get('/list', (req, res, next) => {
    Pet.find({})
        .then(pets => {
            // console.log(pets)
            res.render("lostPets", { pets })
        }).catch((err) => {
            console.log(err)
        });
});

router.get('/add', (req, res, next) => {
    res.render("pets-edit");
});

router.post("/add", uploadCloud.single("photo_url"), (req, res, next) => {
  Pet.create({
    name: req.body.name,
    type_animal: req.body.type_animal,
    size: req.body.size,
    // wasFounded: req.body.wasFounded,
    description: req.body.description,

    photo_url: req.file.url
  
  })
    .then(newPet => {
      // console.log(newPet)
      res.redirect("/pet/list");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/detail/:id', (req, res, next) => {
    Pet.findOne({ _id: req.params.id })
        .then(pet => {
            res.render("detail", { pet })
        }).catch((err) => {
            console.log(err)
        });

});

// router.post('/:id/delete', (req, res, next) => {
   
//     Pet.findByIdAndRemove({ _id: req.params.id })
//         .then(petDelete => res.redirect("/"))
//         .catch((err) => {
//             console.log(err)
//         });
// });

router.get('/edit/:id', (req, res, next) => {
    Pet.findOne({ _id: req.params.id })
        .then(pet => {
            res.render("pets-edit", { pet })
        }).catch((err) => {
            console.log(err)
        });

});

router.get("/petInfo/:id", (req, res) => {
  Pet.findById(req.params.id).then(petInfo => res.json(petInfo));
});

router.put("/petUpdate", (req, res) => {
    
  Pet.findByIdAndUpdate(req.body.id, req.body).then(updatedPet =>
    res.json({updated: true})
  );
});

router.post("/lostPets", (req, res) => {
  Pet.findByIdAndUpdate(req.body._id, {
    // shelter: req.body.shelter,
    name: req.body.name,
    // type_animal: "Dog",
    size: req.body.size

    // wasFounded: false,
    // description: "Encontrado pequeño caniche blanco",
    // photo_name: "original name", //req.file.originalname,
    // photo_url:
    //   "https://www.hogarmania.com/archivos/201705/mascotas-perros-razas-caniche-668x400x80xX.jpg", //req.file.url,
    // location: {
    //   type: "Point",
    //   coordinates: [+req.body.longitude, +req.body.latitude]
    // },
    // neighborhood: ["Puente Vallecas"],
    // found_by: req.user.id
  })
    .then(updatedPet => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

router.delete("/petDeletion/:petId", (req, res) => {
  Pet.findByIdAndDelete(req.params.petId)
    .then(() => {
      res.json({ deleted: true });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/json', (req, res, next) => {
    Place.find().then(pets => {
        res.json({ pets })
    }).catch((err) => {
        console.log(err)
    });
});

module.exports = router;