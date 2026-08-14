const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signUp",(req,res)=>{
    res.render("users/signUp.ejs");
});

router.post("/signUp",wrapAsync(async (req,res)=>{
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ username, email });

        const registeredUser = await User.register(newUser, password);

        console.log("User registered successfully", registeredUser);

        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");

    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signUp");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

//passport will itself authenticate and will work as a middleware
router.post("/login",passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(async(req,res)=>{
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
}));


module.exports=router;