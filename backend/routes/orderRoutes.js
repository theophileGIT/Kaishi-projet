const withAuth = require('../middleware/withAuth');

module.exports = (app, db) => {
    const ProductModel = require("../models/ProductModel")(db);
    const OrderModel = require("../models/OrderModel")(db);
    const UserModel = require("../models/UserModel")(db);
    const orderControllers = require("../controllers/orderControllers")(ProductModel, OrderModel, UserModel);
    
    // *****************************************************************
    // PENSER A REMETTRE withAuthAdmin dans les routes le nécessitant
    // *****************************************************************

    //route de sauvegarde complète d'une commande
    app.post('/api/v1/order/save', withAuth, orderControllers.saveOrder);
    //route de gestion du paiement (va analyser le bon fonctionnement du paiement)
    app.post('/api/v1/order/payment', withAuth, orderControllers.executePayment);
    //route de modification du status de paiement de la commande
    app.put('/api/v1/order/validate', withAuth, orderControllers.updatePaymentStatus);
    //route de récupération de toutes les commandes
    app.get('/api/v1/order/all', withAuth, orderControllers.getAllOrder);
    //route de récupération d'une commande
    app.get('/api/v1/order/getOneOrder/:id', withAuth, orderControllers.getOneOrder);
}
