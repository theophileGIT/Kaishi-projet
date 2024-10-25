const express = require("express")
const app = express()

const mysql = require("promise-mysql")
const cors = require("cors")

app.use(cors())

const fileUpload = require('express-fileupload')

app.use(fileUpload({
    createParentPath: true
}))

//parse les url
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

const dotenv = require("dotenv")
dotenv.config()

//on récupère nos routes
const authRoutes = require("./routes/authRoutes")
const contactsRoutes = require("./routes/contactsRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productsRoutes = require("./routes/productsRoutes")
const userRoutes = require("./routes/userRoutes")


mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

}).then((db) => {
    setInterval(async () => {
        const res = await db.query("SELECT 1")
    }, 10000)

    app.get('/', async (req, res, next) => {
        res.json({ status: 200, msg: "bienvenu sur Kaishi projet API" })
    })

    userRoutes(app, db)
    authRoutes(app, db)
    productsRoutes (app,db)
    contactsRoutes(app, db)
    orderRoutes(app, db)
}).catch(err => console.log(err))

const PORT = process.env.PORT || 9500
app.listen(PORT, () => {
    console.log(`Serveur à l'écoute sur le port ${PORT}`)
})