const withAuth = require('../middleware/withAuth');

module.exports = (app, db) => {
    const ProductModel = require("../models/ProductModel")(db);
    const OrderModel = require("../models/OrderModel")(db);
    const UserModel = require("../models/UserModel")(db);
    const orderControllers = require("../controllers/orderControllers")(ProductModel, OrderModel, UserModel);

    // Routes de gestion des commandes
    app.post('/api/v1/order/save', withAuth, orderControllers.saveOrder);
    app.post('/api/v1/order/payment', withAuth, orderControllers.executePayment);
    app.put('/api/v1/order/validate', withAuth, orderControllers.updatePaymentStatus);
    app.get('/api/v1/order/all', withAuth, orderControllers.getAllOrder);
    app.get('/api/v1/order/getOneOrder/:id', withAuth, orderControllers.getOneOrder);
};
