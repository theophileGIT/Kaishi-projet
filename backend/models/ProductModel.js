class ProductModel {
    static getAllProducts() {
        return db.query('SELECT * FROM products')
            .then((res) => res)
            .catch((err) => err);
    }

    static getOneProduct(id) {
        return db.query('SELECT * FROM products WHERE id = ?', [id])
            .then((res) => res)
            .catch((err) => err);
    }

    static saveOneProduct(req){
        return db.query('INSERT INTO products (name, description, price, picture, hoverPicture, quantity, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [req.body.name, req.body.description, req.body.price, req.body.picture,req.body.hoverPicture, req.body.quantity])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    static async updateOneProduct(id, updatedProduct) {
        try {
            const currentProduct = await db.query('SELECT hoverPicture FROM products WHERE id = ?', [id]);

            if (currentProduct.length === 0) {
                return { success: false, code: 404, message: "Produit non trouvé." };
            }

            const oldHoverPicture = currentProduct[0].hoverPicture;
            const hoverPicture = updatedProduct.hoverPicture || oldHoverPicture;

            const res = await db.query(
                'UPDATE products SET name = ?, description = ?, price = ?, picture = ?, hoverPicture = ?, quantity = ? WHERE id = ?',
                [updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.picture, hoverPicture, updatedProduct.quantity, id]
            );

            return { success: true, affectedRows: res.affectedRows };
        } catch (err) {
            console.error("Erreur lors de la mise à jour du produit:", err);
            return { success: false, code: 500, error: err };
        }
    }

    static deleteOneProduct(id) {
        return db.query('DELETE FROM products WHERE id = ?', [id])
            .then((res) => {
                if (res.affectedRows === 0) {
                    return { code: 404, msg: "Produit non trouvé" };
                }
                return { success: true };
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression du produit:", err);
                return { code: 500, error: err };
            });
    }

    static deleteOrderDetailsByProductId(productId) {
        return db.query('DELETE FROM ordersdetails WHERE products_id = ?', [productId])
            .then((res) => {
                return { success: true, affectedRows: res.affectedRows };
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression des détails de commande:", err);
                return { code: 500, error: err };
            });
    }
}

module.exports = (dbInstance) => {
    db = dbInstance;
    return ProductModel;
};
