const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const cookieParser=require("cookie-parser");

//to use cookie parser middleware
app.use(cookieParser("secretcode"));

//but we can actually tamper the cookies - so we sign cookies to make them secure and not tamperable
//basically we can set properties
app.get("/getsignedcookies",(req,res)=>{
    res.cookie("made_in","India",{signed:true});
    res.send("sent some signed cookies");
})

//verify signed cookies - 
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send(req.signedCookies);
})


//sending cookies
app.get("/getcookies",(req,res)=>{
    res.cookie("greet","Hello World");
    res.cookie("made_in","India");
    res.send("sent some cookies");
})

//making greet cookie
app.get("/greet",(req,res)=>{
    let {name="annonymous"} = req.cookies;
    res.send(`Hi ${name}`);
});

app.get("/",(req,res)=>{
    //getting cookies - we'll need cookie-parser middleware to parse cookies from the request
    //npm install cookie-parser
    console.dir(req.cookies);
  res.send("Hello World");  
})

//will match path with /users and then will go to user.js file and check for the rest of the path
//basically if we still have /users in the path then it will be removed and the rest of the path will be checked in user.js file
app.use("/users",users);
app.use("/posts",posts);
app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

