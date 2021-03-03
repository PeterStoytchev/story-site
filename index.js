const Express = require("express");
const path = require("path");

const app = new Express();
app.use(Express.urlencoded({ extended: true})); //json parsing for post requests
app.use(Express.json()); //json parsing for post requests

app.use(Express.static("css")); //serve the css files staticly
app.use(Express.static("js")); //serve the javascript files staticly

//serve the main page
app.get("/stories", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "mainpage.html"));
});


//serve the login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "login.html"));
});


//DATABASE HANDLING

app.post("/api/reguser/", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.authid);

    res.send(JSON.stringify({"code": 200}));
});


app.listen(3000);