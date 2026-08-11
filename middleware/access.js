const express=require("express");
const app=express();

//authentication api - 
const checkToken=("/api",(req,res,next)=>{
    let {token}=req.query;
    if(token==="giveaccess"){
        next();
    }
    res.send("access denied")
})

app.listen(3000,()=>{
    console.log("hello");
})

//yeh ab pehele middle ware ko call karega tab hi execute hoga
app.get("/api",checkToken,(req,res)=>{
    res.send("data");
})

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/random",(req,res)=>{
    res.send("random page");
})