const express = require("express");
const router = express.Router();

//replace all "apps" with router because we dont have access to app in this file
//omdex route
router.get("/omdex",(req,res)=>{
    res.send("Welcome to the omdex route");
});

//show users
router.get("/",(req,res)=>{
    res.send("Here are the users");
});

//show listings
router.get("/listings",(req,res)=>{
    res.send("Here are the listings");
});

module.exports = router;