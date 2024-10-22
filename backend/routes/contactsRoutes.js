const withAuth = require ('../middleware/withAuth')

module.exports = (app, db) => {
    const ContactsModel = require("../models/ContactsModel")(db);
    const contactsControllers = require("../controllers/contactsControllers")(ContactsModel);


// *****************************************************************
        // PENSER A REMETTRE withAuthAdmin dans les routes le nécessitant
    // *****************************************************************
 //route permettant de récupérer tous les produits
    //requete SQL OK 
    //route POSTMAN OK 
    app.post('/api/v1/contact',withAuth,contactsControllers.saveContact)
}