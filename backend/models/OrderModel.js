module.exports = (_db) => {
    db = _db;
    return OrderModel;
};

class OrderModel {
    // Validation d'une commande
    static saveOneOrder(users_id, total_amount) {
        console.log("saveOneOrder appelé avec:", { users_id, total_amount });

        // Vérification des valeurs
        if (!users_id || total_amount === undefined || total_amount <= 0) {
            throw new Error("users_id ou total_amount est manquant ou invalide");
        }

        return db.query(
            'INSERT INTO orders (users_id, total_amount, created_at, status) VALUES (?, ?, NOW(), "not payed")',
            [users_id, total_amount]
        )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la sauvegarde de la commande:", err);
                throw err; // Relance l'erreur pour être attrapée dans le contrôleur
            });
    }

    // Sauvegarde d'un orderdetail
    static saveOneOrderDetail(orders_id, products) {
        const total = parseInt(products.quantityInCart) * parseFloat(products.safePrice);
        return db.query(
            'INSERT INTO ordersdetails (orders_id, products_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
            [orders_id, products.id, products.quantityInCart, total]
        )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la sauvegarde des détails de la commande:", err);
                throw err; 
            });
    }

    // Méthode pour mettre à jour le montant total de la commande
    static updateTotalAmount(orderId, totalAmount) {
        return db.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la mise à jour du montant total de la commande:", err);
                throw err; 
            });
    }

    // Récupération d'une commande en fonction d'un id
    static getOneOrder(id) {
        return db.query('SELECT * FROM orders WHERE id = ?', [id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération de la commande:", err);
                throw err;
            });
    }

    // Récupération d'une seule commande avec détails
    static getOneOrderWithDetails(id) {
        return db.query(`
            SELECT 
                firstname, 
                lastname, 
                email, 
                orders.users_id, 
                total_amount, 
                orders.created_at, 
                status, 
                ordersdetails.orders_id, 
                ordersdetails.products_id, 
                ordersdetails.quantity, 
                ordersdetails.unit_price, 
                products.type, 
                products.description, 
                products.price, 
                products.picture 
            FROM 
                orders 
            INNER JOIN 
                users ON orders.users_id = users.id 
            LEFT JOIN 
                adress ON orders.users_id = adress.users_id 
            LEFT JOIN 
               ordersdetails ON orders.id = ordersdetails.orders_id 
            LEFT JOIN 
                products ON ordersdetails.products_id = products.id 
            WHERE 
                orders.id = ?`, 
            [id]
        )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des détails de la commande:", err);
                throw err;
            });
    }

    // Modification d'un status de commande
    static updateStatus(order_id, status) {
        return db.query('UPDATE orders SET status = ? WHERE id = ?', [status, order_id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la mise à jour du statut de la commande:", err);
                throw err;
            });
    }

    // Récupération de toutes les commandes
    static getAllOrders() {
        return db.query('SELECT * FROM orders')
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération de toutes les commandes:", err);
                throw err;
            });
    }

    // Récupération des détails d'une commande
    static getAllDetails(order_id) {
        return db.query('SELECT ordersdetails.id, ordersdetails.quantity, unit_price, name, description, picture FROM ordersdetails INNER JOIN products ON products.id = ordersdetails.products_id WHERE orders_id = ?', [order_id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des détails de la commande:", err);
                throw err;
            });
    }
}
