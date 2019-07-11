// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Shelter = require("../models/Shelter");
const Pet = require("../models/Pets")
const Axios = require("axios");

const bcryptSalt = 10;
let fakeShelters = [];
let fakePets = [];
let shelterId = undefined
let userId = undefined

mongoose
    .connect("mongodb://localhost/rescuelittleheroes", { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

let users = [{
        username: "ElYesus",
        email: "yesuscryst@heaven.es",
        telephoneNumber: "666666",
        password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
        name: "Jesus",
        surname: "Crist",
        idAdmin: true,
        Role: "Admin"
    },
    {
        username: "francho@themachine.es",
        email: "francho@themachine.es",
        telephoneNumber: "4568902",
        password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
        name: "Franch",
        surname: "G",
        idAdmin: true,
        Role: "Admin"
    }, {
        username: "Pacote",
        email: "Pacote@pil.es",
        telephoneNumber: "678907123",
        password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
        name: "Pacote",
        surname: "Pil",
        idAdmin: true,
        Role: "User"
    }
]

Axios.get('https://randomuser.me/api/', {
        responseType: 'json'
    })
    .then((res) => {
        if (res.status == 200) {
            shelterfake = res.data.results[0]
            let transformedShelters = {
                name: `${shelterfake.name.first} ${shelterfake.name.last}`,
                address: `${shelterfake.location.street}, ${shelterfake.location.postcode} (${shelterfake.location.city})`,
                location: [+shelterfake.location.coordinates.latitude, +shelterfake.location.coordinates.longitude],
                phone: shelterfake.phone,
                email: shelterfake.email,
                website_url: "www.petfinder.com"
            }
            fakeShelters = Array(10).fill().map(x => ({...transformedShelters }))
        }
    })
    .then(() => {
        User.deleteMany()
            .then(() => {
                User
                    .create(users)
                    .then((newuser) => {
                        userId = newuser[0]._id;
                        console.log("FAKE USERS CREATED!!!")
                    })
            })
    })
    .then(() => {
        Shelter.deleteMany()
            .then(() => {
                Shelter
                    .create(fakeShelters)
                    .then((newshelter) => {
                        shelterId = newshelter[0]._id;
                        console.log("FAKE SHELTERS CREATED!!!")
                    })

            })
    })
    .then(() => {
        let dogPict = new Promise((resolve, reject) => {
            Axios.get('https://random.dog/woof.json', {
                    responseType: 'json'
                })
                .then((res) => {
                    resolve(res.data.url)
                })
        });
        let catPict = new Promise((resolve, reject) => {
            Axios.get('https://aws.random.cat/meow', {
                    responseType: 'json'
                })
                .then((res) => {
                    resolve(res.data.file)
                })
        });

        Promise.all([dogPict, catPict]).then(values => {
                fakePets = [{
                    name: 'Sitito',
                    type_animal: 'Dog',
                    size: 'Big',
                    wasFounded: false,
                    description: 'Es un perrito cariñoso que se sube a tu pierna para desmostrarte todo su amor. No se lleva bien con las gatas',
                    photo_name: "Sitito picture",
                    photo_url: values[0],
                    location: { type: 'Point', coordinates: [-3.6749371, 40.3923761] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }, {
                    name: 'Raluquita',
                    type_animal: 'Cat',
                    size: 'Small',
                    wasFounded: false,
                    description: 'Es una gatita muy tranquila que sólo quiere jugar. Cariñosa y nada territorial',
                    photo_name: "Raluquita picture",
                    photo_url: values[1],
                    location: { type: 'Point', coordinates: [-3.6882051, 40.4122453] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }, {
                    name: 'Toby',
                    type_animal: 'Dog',
                    size: 'Medium',
                    wasFounded: false,
                    description: 'Super Can, ¡¡llevatelo a casa!!',
                    photo_name: "Toby picture",
                    photo_url: values[0],
                    location: { type: 'Point', coordinates: [-3.71183, 40.3818751] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }, {
                    name: 'Memphis',
                    type_animal: 'Cat',
                    size: 'Big',
                    wasFounded: false,
                    description: 'Es como un tigre pero más cariñoso.',
                    photo_name: "Memphis picture",
                    photo_url: values[1],
                    location: { type: 'Point', coordinates: [-3.709508, 40.4190058] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }, {
                    name: 'Conan',
                    type_animal: 'Dog',
                    size: 'Small',
                    wasFounded: false,
                    description: 'Terrible amoroso perrote',
                    photo_name: "Conan picture",
                    photo_url: values[0],
                    location: { type: 'Point', coordinates: [-3.6966659, 40.5012179] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }, {
                    name: 'Princesa',
                    type_animal: 'Cat',
                    size: 'Small',
                    wasFounded: false,
                    description: 'La reina de la casa',
                    photo_name: "Princesa picture",
                    photo_url: values[1],
                    location: { type: 'Point', coordinates: [-3.6408218, 40.4392338] },
                    // neighborhood: undefined,
                    found_by: userId,
                    shelter: shelterId
                }]
            })
            .then(() => {
                Pet.deleteMany()
                    .then(() => {
                        Pet.createIndexes({ location: "2dsphere" })

                        Pet
                            .create(fakePets)
                            .then(() => {
                                console.log("FAKE PETS CREATED!!!")
                                mongoose.disconnect()
                            })
                            // 
                    })
            })
    })
    .catch(err => {
        mongoose.disconnect()
        throw err
    })