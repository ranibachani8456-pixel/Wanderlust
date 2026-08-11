const express=require("express");
const app=express();

app.listen(3000,(req,res)=>{
    console.log("hi");
})

app.use("/random",(req,res,next)=>{
    console.log("I am only for random");
    next();
})

//404 - custom error
//error handling middleware
app.use((req,res)=>{
    res.send("page not found");
})

app.get("/",(req,res)=>{
    res.send("hi root");
})

app.get("/random",(req,res)=>{
    res.send("hello random")
})