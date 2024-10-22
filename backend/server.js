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
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname+'/public'))

const dotenv = require("dotenv")
dotenv.config()

//récupération des routes
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const orderRoutes = require("./routes/orderRoutes")
const contactsRoutes = require("./routes/contactsRoutes");
const productsRoutes = require("./routes/productsRoutes")

mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

}).then((db) => {
    console.log('vous êtes bien connecté à la base de donnée')
    setInterval(async () => {
        const res = await db.query("SELECT 1")
    }, 10000)
    
    app.get('/', async (req, res, next) => {
        try {
            res.json({status: 200, msg: "KAISHIPROJECT!"})
        } catch (err) {
            next(err)
        }
    })
    
    userRoutes(app, db)
    authRoutes(app, db)
    orderRoutes(app, db)
    contactsRoutes(app, db)
    productsRoutes(app, db)
}).catch(err=>console.log(err))

const PORT = process.env.PORT || 9500
app.listen(PORT, () => {
    console.log(`Serveur à l'écoute sur le port ${PORT}!`)
})