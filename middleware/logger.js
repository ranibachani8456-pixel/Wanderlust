const express=require("express");
const app=express();

app.listen(3000,()=>{
    console.log("hello");
})

//creating logger
app.use((req,res,next)=>{
    //manipulating request
    req.time=new Date(Date.now()).toString();

    console.log(req.method,req.hostname,req.path,req.time);
    next();
})

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/random",(req,res)=>{
    res.send("random page");
})