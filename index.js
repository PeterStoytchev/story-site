const Express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const utils = require("./utils");
const crypto = require('crypto');

const db = new sqlite3.Database("data.db");

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

//serve the user profile page
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "userprofile.html"));
});

//serve the story uploader
app.get("/storyuploader/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "storyuploader.html"));
});

//serve the story category browser
app.get("/categories/:storyType", (req, res) => {
    var storyType = req.params["storyType"];

    var html = `<html><head><title>Categories!</title> <link rel="stylesheet" href="../../storyviewer.css"></head> <body>`;
    html = html + `<h1>Here are all stories that are in the ${storyType} category!</h1>`;

    db.all(`SELECT author_username,storyTitle,storyId FROM story_index WHERE storyType= ?`, [storyType], (err, rows) => {
        if (err)
        {
            console.log(err);
            res.send(500);
        }
        else if (rows == undefined || rows.length == 0)
        {
            html = html + `<h2>There are no stories in this category!</h2></body></html>`;
            res.send(html);
        }
        else
        {
            rows.forEach(row => {
                html = html + `<h2><a href='/stories/${row.storyId}'>${row.storyTitle}, written by: ${row.author_username}</h2></body></html>`;
            });
            res.send(html);
        }
    });
});


//serve the story viewer
app.get("/stories/:storyId", (req, res) => {
    var storyId = req.params["storyId"];

    db.get(`SELECT author_username,storyTitle,storyType,storyText FROM story_index WHERE storyId= ?`, [storyId], (err, rows) => {
        if (err)
        {
            console.log(err);
            res.send(500);
        }
        else if (rows == undefined)
        {
            var html = `<html><head><title>Not Found</title></head> <body> <h1 style="text-align:center">Could't find this story!</h1></body></html>`;
            res.send(html);
        }
        else
        {
            var html = `<html><head><title>${rows.storyTitle}</title> <link rel="stylesheet" href="../../storyviewer.css"> </head> <body> <h1>${rows.storyTitle}</h1></body></html>`;
            html = html + `<h2>Written by ${rows.author_username}</h2> <p>${rows.storyText}</p> </body></html>`;
            res.send(html);
        }
    });
});


//handle story uploads
app.post("/storyuploader/upload", (req, res) => {
    const body = req.body;
    const story_hash = crypto.createHash('md5').update(body.text).digest("hex");
    db.run(`INSERT INTO 'story_index'('author_username', 'storyTitle', 'storyType', 'storyId', 'storyText') VALUES (?,?,?,?,?)`, [body.author, body.storyName, body.storyType, story_hash, body.text], (err) => {
        if (err)
        {
            console.log(err);
            res.send(409);
        }
        else
        {
            db.get(`SELECT storyIds FROM users WHERE username= ?`, [body.author], (err, rows) => {
                var split = rows.storyIds.split(';');
                if (split[0] != "NULL")
                {
                    split.push(story_hash);
                }
                else
                {
                    split = [story_hash];
                }

                var str = split[0];
                for (var i = 1; i < split.length; i++)
                {
                    str = str + ";" + split[i];
                }

                db.run("UPDATE users SET storyIds = ? WHERE username = ?", [str, body.author], (err) => {
                    if (err) { console.log(err);}
                });

                res.send(200);
            });
        }
    });
});

//DATABASE HANDLING
app.post("/api/getuserstories/", (req, res) => {
    db.all(`SELECT storyTitle,storyType,storyId FROM story_index WHERE author_username= ?`, [req.body.username], (err, rows) => {
        if (err)
        {
            console.log(err);
            res.send(409);
        }
        else
        {
            var titles = [];
            var storyIds = [];
            var storyTypes = [];

            rows.forEach(row => {
                titles.push(row.storyTitle);
                storyIds.push(row.storyId);
                storyTypes.push(row.storyType);
            });

            res.send(JSON.stringify({"titles": titles, "storyIds": storyIds, "storyTypes": storyTypes}));
        }
    });
});

app.post("/api/reguser/", (req, res) => {
    db.run(`INSERT INTO 'users'('username', 'password', 'authId', 'storyIds') VALUES (?,?,?,?)`, [req.body.username, req.body.password, req.body.authid, "NULL"], (err) => {
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

app.listen(3000, () => {
    console.log("Server online!");
});