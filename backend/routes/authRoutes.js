const withAuth = require ('../middleware/withAuth')

module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const authControllers = require("../controllers/authControllers")(UserModel)
    
    //route de vérification du token et de reconnexion automatique
    app.get('/api/v1/user/checkToken', withAuth, authControllers.checkToken)
}

