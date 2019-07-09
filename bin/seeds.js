// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Shelter = require("../models/Shelter");
const Axios = require("axios");

const bcryptSalt = 10;
let fakeShelters = [];

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
        username: "Francho",
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
            console.log(res.data.results[0])
            shelterfake = res.data.results[0]
            let transformedShelters = {
                name: `${shelterfake.name.first} ${shelterfake.name.last}`,
                address: `${shelterfake.location.street}, ${shelterfake.location.postcode} (${shelterfake.location.city})`,
                location: [+shelterfake.location.coordinates.latitude, +shelterfake.location.coordinates.longitude],
                phone: shelterfake.phone,
                email: shelterfake.email,
                website_url: "www.petfinder.com"
            }
            fakeShelters = Array(100).fill().map(x => ({...transformedShelters }))
        }
    })
    .then(() => {
        User.deleteMany()
            .then(() => {
                User
                    .create(users)
                console.log("FAKE USERS CREATED!!!")
            })
    })
    .then(() => {
        Shelter.deleteMany()
            .then(() => {
                Shelter
                    .create(fakeShelters)
                console.log("FAKE SHELTERS CREATED!!!")
            })
    })
    .then(() => {
        Axios.get('https://random.dog/woof.json', {
                responseType: 'json'
            })
            .then((res) => {
                console.log(res.data.url)
                mongoose.disconnect()
            })
    })
    .catch(err => {
        mongoose.disconnect()
        throw err
    })