// Middleware d'authentification admin
const withAuthAdmin = require('../middleware/withAuthAdmin');

module.exports = (app, db) => {
    const ProductModel = require("../models/ProductModel")(db);
    const productControllers = require("../controllers/productControllers")(ProductModel);

    // Route pour récupérer tous les produits
    app.get('/api/v1/product/all', productControllers.getAllProducts);

    // Route pour récupérer un seul produit
    app.get('/api/v1/product/one/:id', productControllers.getOneProduct);

    // Route pour enregistrer un produit
    app.post('/api/v1/product/save', withAuthAdmin, productControllers.saveProducts);

    // Route pour modifier un produit
    app.put('/api/v1/product/update/:id', withAuthAdmin, productControllers.updateProduct);

    // Route pour supprimer un produit
    app.delete('/api/v1/product/delete/:id', withAuthAdmin, productControllers.deleteProduct);


    // Route pour ajouter une image
    app.post('/api/v1/product/pict', productControllers.savePicture);
};
