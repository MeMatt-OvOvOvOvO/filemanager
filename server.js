var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

var hbs = require('express-handlebars');
var formidable = require('formidable');
var path = require("path")
var dict = { files: []}
var log = false
var id = 0
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}));
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs', partialsDir: "views/partials" }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');
app.use(express.json())

app.get("/", function (req, res) {
    res.render('upload.hbs', { layout: "main.hbs" });
})
app.get("/upload", function (req, res) {
    res.render('upload.hbs', { layout: "main.hbs" });
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', dict);
})
app.get("/info", function (req, res) {
    res.render('info.hbs', { layout: "main.hbs" });
})
app.post('/handleUpload', function (req, res) {
    let form = formidable({});
    form.uploadDir = __dirname + '/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true   // zapis z rozszerzeniem pliku
    form.multiples = true
    howManyF = 'none';
    form.parse(req, function (err, fields, files) {
        if(Array.isArray(files.uploadFile)){
            howManyF = 'some'
        }else if(files.uploadFile.size != 0){
            howManyF = 'one'
        }

        if(howManyF == 'one'){
            let img = 'default.png'
            if(files.uploadFile.type == 'image/png'){
                img = 'png.png'
            }else if(files.uploadFile.type == 'application/x-zip-compressed'){
                img = 'zip.png'
            }else if(files.uploadFile.type == 'image/jpeg' && files.uploadFile.type == 'imafe/jpg'){
                img = 'jpg.png'
            }else if(files.uploadFile.type == 'application/pdf'){
                img = 'pdf.png'
            }else if(files.uploadFile.type == 'text/javascript'){
                img = 'js.png'
            }else if(files.uploadFile.type == 'text/plain'){
                img = 'txt.png'
            }else if(files.uploadFile.type == 'text/css'){
                img = 'css.png'
            }
            let dictWithData = { id: id, img: img, name: files.uploadFile.name, size: files.uploadFile.size, type: files.uploadFile.type, path: files.uploadFile.path, date: Date.now()}
            dict.files.push(dictWithData)
            id += 1
        }else if(howManyF == 'some'){
            for(const myVar in files.uploadFile){
                let img = 'default.png'
                if(files.uploadFile[myVar].type == 'image/png'){
                    img = 'png.png'
                }else if(files.uploadFile[myVar].type == 'application/x-zip-compressed'){
                    img = 'zip.png'
                }else if(files.uploadFile[myVar].type == 'image/jpeg'){
                    img = 'jpg.png'
                }else if(files.uploadFile[myVar].type == 'application/pdf'){
                    img = 'pdf.png'
                }else if(files.uploadFile[myVar].type == 'text/javascript'){
                    img = 'js.png'
                }else if(files.uploadFile[myVar].type == 'text/plain'){
                    img = 'txt.png'
                }else if(files.uploadFile[myVar].type == 'text/css'){
                    img = 'css.png'
                }
                let dictWithData = { id: id, img: img, name: files.uploadFile[myVar].name, size: files.uploadFile[myVar].size, type: files.uploadFile[myVar].type, path: files.uploadFile[myVar].path, date: Date.now()}
                dict.files.push(dictWithData)
                id += 1
            }
        }



        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);

        res.redirect('/upload')
    });
});

app.post("/deleteFiles/:index", function (req, res) {
    let index = req.params.index;
    for (const myVar in dict.files) {
        if (dict.files[myVar].id == index) {
            dict.files.splice(myVar, 1);
        }
    }
    res.redirect("/filemanager");
})
app.post("/download/:index", function (req, res) {
    let index = req.params.index;
    for (const myVar in dict.files) {
        if (dict.files[myVar].id == index) {
            res.download(dict.files[myVar].path)
        }
    }
})
app.post("/deleteAll", function (req, res) {
    dict.files.splice(0, dict.files.length);
    res.redirect("/filemanager");
})
app.post("/info/:index", function (req, res) {
    let index = req.params.index;
    let infoContext = {};
    for (const myVar in context.files) {
        if (context.files[myVar].id == index) {
            infoContext = context.files[myVar];
        }
    }
    res.render('info.hbs', infoContext)
})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})