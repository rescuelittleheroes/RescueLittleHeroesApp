const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinary.js");

router.get("/form-is-admin",(req,res)=>{
  res.render("shelters-edit")
})

router.post("/is-admin",(req,res)=>{
  let {username} = req.body
  User.findOne({username})
  .then(user => {
    res.status(200).json(user.isAdmin)
  })
})

module.exports = router