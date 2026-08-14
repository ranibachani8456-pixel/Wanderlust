const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signUp",(req,res)=>{
    res.render("users/signUp.ejs");
});

router.post("/signUp",wrapAsync(async (req,res)=>{
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ username, email });

        const registeredUser = await User.register(newUser, password);

        console.log("User registered successfully", registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                console.log(err);
                req.flash("error", "Error logging in after registration. Please try logging in manually.");
                return res.redirect("/login");
            }
        req.flash("success","Welcome to Wanderlust");
        const redirectUrl = req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl || "/listings");
        })

    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signUp");
    }
}));

router.get("/login",
    saveRedirectUrl,
    (req,res)=>{
    res.render("users/login.ejs");
});

//passport will itself authenticate and will work as a middleware
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome back!");

        const redirectUrl = req.body.redirectUrl || "/listings";

        res.redirect(redirectUrl || "/listings");
    })
);

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
            req.flash("error", "Error logging out. Please try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
})

module.exports=router;