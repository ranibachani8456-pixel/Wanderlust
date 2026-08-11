const express = require("express");
const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Logger
app.use("/random", (req, res, next) => {
    console.log("I am only for random");
    next();
});

// Routes
app.get("/", (req, res) => {
    res.send("Hi Root");
});

app.get("/random", (req, res) => {
    res.send("Hello Random");
});

app.get("/err", (req, res) => {
    throw new Error("Something went wrong");
});

// 404 middleware (always last before error handler)
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Error handling middleware (always last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});