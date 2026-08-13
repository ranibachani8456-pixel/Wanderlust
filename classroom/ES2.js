const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

const sessionOptions={
    secret:"secretCode",
    resave:false,  
    saveUninitialized:true,
};

app.listen(3000,(req,res)=>{   
    console.log("server is running on port 3000");
})

//flash karwane ke liye, we will use views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use("/users",users);
app.use("/posts",posts);

app.use(session(sessionOptions));
app.use(flash()); 

//Register
//link se change karo - from query
app.get("/register",(req,res)=>{
    let {name="anaya"}=req.query;
    
    //we can access req,session.name in any route after this
    req.session.name=name;
    console.log(req.session);
    //req.flash("success","user registered successfully");

    if(name==="anaya"){
        req.flash("error","user not registered");
    }
    else{
        req.flash("success","user registered successfully");
    }
    res.redirect("/hello");
})

//req.session will print -> Session {
//   cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
// }

//hello
app.get("/hello",(req,res)=>{
    //console.log(req.flash("success"));
    //to use flash messages in better way
    res.locals.success=req.flash("success");
    res.locals.errors=req.flash("error");

    res.render("page.ejs",{name:req.session.name});
    //success is key jiss se req.session.name access hoga
});

