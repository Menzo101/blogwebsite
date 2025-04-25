const express = require("express");
const exphbs = require("express-handlebars")
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser")
const fileupload = require("express-fileupload")
require("dotenv").config()

const blogrouter = require("./router/generalrouter")
const authrouter = require("./router/authrouter")
const app = express()
// injert view engine
app.engine(
    "hbs",
    exphbs.engine({
        extname: ".hbs",
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true,
        },
    })
);

// set view engine
app.set("view engine", "hbs");



app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieparser())
app.use(fileupload())
// mongoose connect 
const DATABASE = process.env.DBURL

mongoose.connect(DATABASE).then(() => {
    console.log("connected to database")
}).catch(err => {
    console.log("you are not connected" + err)
})



// SoundBox routes 

// BLOGS ROUTES

app.use("/", blogrouter)
app.use("/", authrouter)
app.get('/about', (req, res) => {
    res.render('about',)
});

app.get('/create', (req, res) => {
    res.render('create')
});
// app.use((req, res) => {
//     res.render('404')
// })

app.listen(3000, () => {
    console.log("listening on port 3000")
});