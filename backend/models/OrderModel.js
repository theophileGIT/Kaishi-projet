class OrderModel {
    constructor(db) {
        this.db = db;
    }

    // Méthode pour sauvegarder une commande avec l'utilisateur et le montant total
    async saveOneOrder(users_id, total_amount) {
        if (!users_id || total_amount === undefined || total_amount <= 0) {
            throw new Error("users_id ou total_amount est manquant ou invalide");
        }

        try {
            const res = await this.db.query(
                'INSERT INTO orders (users_id, total_amount, created_at, status) VALUES (?, ?, NOW(), "not payed")',
                [users_id, total_amount]
            );
            return res;
        } catch (err) {
            console.error("Erreur lors de la sauvegarde de la commande:", err.message);
            throw err;
        }
    }

    // Méthode pour sauvegarder les détails d'une commande
    async saveOneOrderDetail(orders_id, products) {
        const total = parseInt(products.quantityInCart) * parseFloat(products.safePrice);
        try {
            const res = await this.db.query(
                'INSERT INTO ordersdetails (orders_id, products_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [orders_id, products.id, products.quantityInCart, total]
            );
            return res;
        } catch (err) {
            console.error("Erreur lors de la sauvegarde des détails de la commande:", err.message);
            throw err;
        }
    }

    // Méthode pour mettre à jour le montant total d'une commande
    async updateTotalAmount(orderId, total_amount) {
        try {
            const res = await this.db.query(
                'UPDATE orders SET total_amount = ? WHERE id = ?',
                [total_amount, orderId]
            );
            return res;
        } catch (err) {
            console.error("Erreur lors de la mise à jour du montant total :", err.message);
            throw err;
        }
    }

    // Méthode pour obtenir toutes les commandes
    async getAllOrders() {
        try {
            const res = await this.db.query('SELECT * FROM orders');
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération de toutes les commandes:", err.message);
            throw err;
        }
    }

    // Méthode pour obtenir une commande spécifique
    async getOneOrder(orderId) {
        try {
            const res = await this.db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            if (res.length === 0) {
                throw new Error("Commande non trouvée");
            }
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération de la commande:", err.message);
            throw err;
        }
    }

    // Méthode pour obtenir les détails d'une commande
    async getAllDetails(orderId) {
        try {
            const res = await this.db.query('SELECT * FROM ordersdetails WHERE orders_id = ?', [orderId]);
            return res;
        } catch (err) {
            console.error("Erreur lors de la récupération des détails de la commande:", err.message);
            throw err;
        }
    }

    // Méthode pour mettre à jour le statut d'une commande
    async updateStatus(orderId, status) {
        try {
            const res = await this.db.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, orderId]
            );
            return res;
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut de la commande:", err.message);
            throw err;
        }
    }
}

module.exports = (db) => new OrderModel(db);
