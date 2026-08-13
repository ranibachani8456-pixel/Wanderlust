const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const session=require("express-session");

//express sessions is a npm package that allows us to store data on the server side and associate it with a specific user session. 
//express sessions uses cookies to identify the user session. 

//can add diff options inside session
app.use(session({
    secret:"secretcode", //used to sign the session ID cookie, which is sent to the client. This helps prevent tampering with the session data.
    resave:false, //forces the session to be saved back to the session store, even if the session was never modified during the request. Setting this to false can help reduce unnecessary session store writes.
    saveUninitialized:true, //forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. Setting this to true can be useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
}));

app.get("/reqCounter",(req,res)=>{
    
    if(req.session.counter){
        req.session.counter++;
    } else {
        req.session.counter = 1;
    }
    res.send(`You sent a request ${req.session.counter} times`);
});

// app.get("/testRoute",(req,res)=>{
//     res.send("Test Successful");
// })


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});