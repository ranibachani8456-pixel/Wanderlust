const express=require("express");
const router=express.Router();

//POSTS
//index
router.get("/",(req,res)=>{
    res.send("Here are the posts");
});

//show
router.get("/:id",(req,res)=>{
    const {id}=req.params;
    res.send(`Here is the post with id ${id}`);
});

//create
router.post("/",(req,res)=>{
    res.send("Creating a new post");
});

//update
router.put("/:id",(req,res)=>{
    const {id}=req.params;
    res.send(`Updating the post with id ${id}`);
});

//delete
router.delete("/:id",(req,res)=>{
    const {id}=req.params;
    res.send(`Deleting the post with id ${id}`);
});

module.exports = router;