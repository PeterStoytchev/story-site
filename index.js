const Express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const utils = require("./utils");

const db = new sqlite3.Database("users.db");

utils.InitDB(db);

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
    db.run(`INSERT INTO 'users'('username', 'password', 'authId') VALUES (?,?,?)`, [req.body.username, req.body.password, req.body.authid], (err) => {
        if (err)
        {
            console.log(err);
            res.send(409);
        }
        else
        {
            res.send(200);
        }
    });
});

app.post("/api/login/", (req, res) => {
    db.get(`SELECT username,password FROM users WHERE username='${req.body.username}'`, [], (err, rows) => {
        if (err)
        {
            console.log(err);
            res.send(500);
        }
        else if (rows == undefined) //no user found in db
        {
            res.send(404);
        }
        else
        {
            if (req.body.password == rows.password)
            {
                db.run("UPDATE users SET authId = ? WHERE username = ?", [req.body.authid, req.body.username], (err) => {
                    if (err) { console.log(err);}
                    res.send(200);
                });
            }
            else
            {
                res.send(403);
            }
        }
    });
});

app.post("/api/checkId/", (req, res) => {
    db.get(`SELECT username,authId FROM users WHERE username='${req.body.username}'`, [], (err, rows) => {
        if (err)
        {
            console.log(err);
            res.send(500);
        }
        else if (rows == undefined) //no user found in db
        {
            res.send(404);
        }
        else
        {
            if (req.body.id == rows.authId)
            {
                res.send(200);
            }
            else
            {
                res.send(403);
            }
        }
    });
});

app.listen(3000);