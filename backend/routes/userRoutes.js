const withAuth = require ('../middleware/withAuth')

module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const userControllers = require("../controllers/userControllers")(UserModel)
    
    
    //route d'enregistrement d'un utilisateur
    app.post('/api/v1/user/save', userControllers.saveUser)
    //route de connexion d'un utilisateur (c'est ici qu'on va créer le token qu'on va envoyer vers le front)
    app.post('/api/v1/user/login', userControllers.loginUser)
    //route de modification d'un utilisateur
    app.put('/api/v1/user/update/:id', withAuth, userControllers.updateUser)
    //route de suppresion d'un utilisateur
    app.delete('/api/v1/user/delete/:id', withAuth, userControllers.deleteUser)
}
