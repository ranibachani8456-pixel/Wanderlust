//create an admin route wth 403 status code for everyone who cant access

const express = require("express");
const app = express();
const expressError = require("./expressError");

console.log(expressError);

const checkToken = (req, res, next) => {
    const {token} = req.query;
    if (token==="giveaccess") {
        next();
    }
    throw new expressError(401,"lol");
};

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


// Routes
app.get("/api",checkToken, (req, res) => {
    res.send("data");
});

app.get("/", (req, res) => {
    res.send("Hi Root");
});

app.get("/admin",(req,res)=>{
    throw new expressError(403,"Access is forbidden");
})

app.get("/random", (req, res) => {
    res.send("Hello Random");
});

app.get("/err",(req,res)=>{
    abcd=abcd;
})

app.use((err,req,res,next)=>{
    //assigning a default value to status and message if they are not provided in the error object
    let {status=500,message="heyooo"}=err;
    res.status(status).send(message)
})

// app.get("/err", (req, res) => {
//     abcd=abcd;
// });

