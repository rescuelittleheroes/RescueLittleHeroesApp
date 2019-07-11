const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPas,
            email: req.body.email,
            surname: req.body.surname
                // telephoneNumber: "555987098",
                // password: "test",
                // name: "TestName",
                // isAdmin: true,
                // role: "Admin"
        });

        newUser.save()
            .then(() => {
                console.log("HE CREADO EL USUARIOOOOOOOOOOO!!!!!!")
                res.redirect("/");
            })
            .catch(err => {
                res.render("auth/signup", { message: "Something went wrong" });
            })
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

//added these owns features for the users...plus of auth.js

router.post('/:id/delete', (req, res, next) => {
    User.findByIdAndRemove({ _id: req.params.id })
        .then(userDelete => res.redirect("/"))
        .catch((err) => {
            console.log(err)
        });
});
router.get('/edit/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            res.render("edit", { user })
        }).catch((err) => {
            console.log(err)
        });

});

router.post("/edit-place", (req, res) => {
    User
        .findByIdAndUpdate(req.body._id, {
            username: "test",
            email: "prueba@gmail.com",
            telephoneNumber: "555987098",
            password: "test",
            name: "TestName",
            surname: "TestName",
            isAdmin: true,
            role: "Admin"
        })
        .then(updatedPet => {
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err)
        });
})



router.get("/auth/slack/callback", passport.authenticate("slack", {
    successRedirect: "/shelters",
    failureRedirect: "/"
}));


router.get("/auth/instagram/callback", passport.authenticate("instagram", { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);

router.get("/auth/github", passport.authenticate("github"));

router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);


module.exports = router;