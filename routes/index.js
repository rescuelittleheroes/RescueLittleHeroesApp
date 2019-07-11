const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get("/login", (req, res, next) => {
    console.log("mandame a la ...")
    res.redirect("/auth/login");
});




module.exports = router;