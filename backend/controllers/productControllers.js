const fs = require("fs");
const ProductModel = require("../models/ProductModel");

module.exports = (ProductModel) => {
    const saveProducts = async (req, res) => {
        try {
            const product = await ProductModel.saveOneProduct(req)
            console.log(product)
            if (product.code) {
                res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
            } else {
                res.json({ status: 200, msg: "produit enregistrée!" })
            }
        } catch (err) {
            console.log(err)
            res.json({ status: 500, msg: "Oups, une erreur est survenue!" })
        }
    };

    const updateProduct = async (req, res) => {
        try {
            const updatedProduct = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                picture: req.body.picture,
                hoverPicture: req.body.hoverPicture,
                quantity: req.body.quantity
            };

            const product = await ProductModel.updateOneProduct(req.params.id, updatedProduct);
            if (!product.success) {
                return res.json({ status: product.code || 500, msg: product.message || "Une erreur est survenue." });
            } else {
                return res.json({ status: 200, msg: "Produit modifié!" });
            }
        } catch (err) {
            console.log(err);
            return res.json({ status: 500, msg: "Une erreur est survenue." });
        }
    };

    const deleteProduct = async (req, res) => {
        try {
            const product = await ProductModel.getOneProduct(req.params.id);
            if (product.code) {
                return res.json({ status: 404, msg: "Produit introuvable." });
            }

            await ProductModel.deleteOrderDetailsByProductId(req.params.id);

            const deleteResult = await ProductModel.deleteOneProduct(req.params.id);
            if (!deleteResult.success) {
                return res.json({ status: 500, msg: "Erreur lors de la suppression du produit." });
            }

            if (product[0].picture && product[0].picture !== "no-pict.jpg") {
                const imagePath = `public/images/${product[0].picture}`;
                try {
                    await fs.promises.unlink(imagePath);
                    return res.json({ status: 200, msg: "Produit et image supprimés avec succès!" });
                } catch (err) {
                    return res.json({ status: 500, msg: "Produit supprimé, mais erreur lors de la suppression de l'image." });
                }
            } else {
                return res.json({ status: 200, msg: "Produit supprimé avec succès!" });
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Erreur lors de la suppression du produit." });
        }
    };

    const getOneProduct = async (req, res) => {
        try {
            const product = await ProductModel.getOneProduct(req.params.id);
            if (!product || product.code) {
                return res.json({ status: 404, msg: "Produit introuvable." });
            } else {
                return res.json({ status: 200, result: product[0] });
            }
        } catch (err) {
            return res.json({ status: 500, msg: "Erreur lors de la récupération du produit." });
        }
    };

    const getAllProducts = async (req, res) => {
        try {
            const products = await ProductModel.getAllProducts();
            if (!products || products.code) {
                return res.json({ status: 500, msg: "Erreur lors de la récupération des produits." });
            }
            return res.json({ status: 200, result: products });
        } catch (err) {
            return res.json({ status: 500, msg: "Erreur lors de la récupération des produits." });
        }
    };

    const savePicture = async (req, res) => {
        try {
            // Check if both pictures are provided
            if (!req.files || !req.files.picture || !req.files.hoverPicture) {
                return res.json({ status: 400, msg: "Les photos n'ont pas pu être récupérées!" });
            }
    
            // Move the main picture
            req.files.picture.mv(`public/images/${req.files.picture.name}`, (err) => {
                if (err) {
                    return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'image!" });
                }
    
                // Move the hover picture inside the first callback
                req.files.hoverPicture.mv(`public/images/${req.files.hoverPicture.name}`, (err) => {
                    if (err) {
                        return res.json({ status: 500, msg: "Erreur lors de l'enregistrement de l'image!" });
                    }
    
                    // Respond with success after both images have been saved
                    return res.json({ status: 200, msg: "Images enregistrées!", url: req.files.picture.name, hoverurl: req.files.hoverPicture.name });
                });
            });
        } catch (err) {
            return res.json({ status: 500, msg: "Erreur lors du téléchargement de l'image." });
        }
    };
    
        return {
            saveProducts,
            updateProduct,
            deleteProduct,
            getAllProducts,
            getOneProduct,
            savePicture
        };
    };
