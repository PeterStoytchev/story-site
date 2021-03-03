const Express = require("express");
const path = require("path");

const app = new Express();

app.use(Express.static("css")); //serve the css files staticly

//serve the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.listen(3000);