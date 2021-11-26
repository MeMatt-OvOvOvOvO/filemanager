var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

var hbs = require('express-handlebars');
var path = require("path")

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');
app.get("/", function (req, res) {
    res.render('login.hbs', { layout: null });
})
app.get("/upload", function (req, res) {
    res.render('upload.hbs', { layout: "main.hbs" });
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { layout: "main.hbs" });
})
app.get("/info", function (req, res) {
    res.render('info.hbs', { layout: "main.hbs" });
})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})