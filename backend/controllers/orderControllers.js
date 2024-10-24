const stripe = require('stripe')('sk_test_51PnH0ZP5fWes0UWvFuIHlcD84KALFosfMjaTFjQsEAWJUe2PtV6Kz1VS3OAPjtPGh0RwxDYcSre0SsF3Lr0FHkqn00hGE9uzle');
const withAuth = require('../middleware/withAuth');

module.exports = (ProductModel, OrderModel, UserModel) => {

    const saveOrder = async (req, res) => {
        try {
            let total_amount = 0;

            // Vérification que le panier n'est pas vide
            if (!req.body.basket || req.body.basket.length === 0) {
                return res.json({ status: 400, msg: "Le panier est vide." });
            }

            // Vérification que user_id est présent
            if (!req.body.user_id) {
                return res.json({ status: 400, msg: "user_id est manquant." });
            }

            const orderPromises = req.body.basket.map(async (b) => {
                console.log("Traitement du produit:", b);

                const product = await ProductModel.getOneProduct(b.id);
                if (product.code) {
                    throw new Error("Échec lors de l'obtention du produit");
                }

                b.safePrice = parseFloat(product[0].price);
                total_amount += parseInt(b.quantityInCart) * b.safePrice; 
            });
            await Promise.all(orderPromises);

            console.log("Montant total calculé:", total_amount);

            // Vérification que le montant total est valide
            if (total_amount <= 0) {
                return res.json({ status: 400, msg: "Le montant total doit être supérieur à zéro." });
            }

            // Enregistrement d'une commande 
            const orderInfos = await OrderModel.saveOneOrder(req.body.user_id, total_amount);
            if (orderInfos.code) {
                return res.json({ status: 500, msg: "Échec enregistrement de la commande!" });
            }

            const id = orderInfos.insertId; 

            // Sauvegarde des détails de la commande
            const detailPromises = req.body.basket.map(async (b) => {
                const detail = await OrderModel.saveOneOrderDetail(id, b);
                if (detail.code) {
                    throw new Error("Échec lors de la sauvegarde des détails de la commande");
                }
            });

            await Promise.all(detailPromises);

            // Mise à jour du montant total de la commande
            const update = await OrderModel.updateTotalAmount(id, total_amount);
            if (update.code) {
                return res.json({ status: 500, msg: "Échec de la mise à jour du montant total!" });
            }

            res.json({ status: 200, orderId: id });
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la commande :", err);
            res.json({ status: 500, msg: "Échec enregistrement de la commande!", error: err.message });
        }
    };

    // Gestion du paiement
    const executePayment = async (req, res) => {
        try {
            const order = await OrderModel.getOneOrder(req.body.orderId);
            if (order.code) {
                return res.json({ status: 500, msg: "Le paiement ne peut pas être vérifié!" });
            }

            console.log("Montant total à payer (en cents) :", order[0].total_amount * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: order[0].total_amount * 100, // Montant en cents
                currency: 'eur', // Devise de paiement
                metadata: { integration_check: 'accept_a_payment' },
                receipt_email: req.body.email
            });

            console.log("Détails du paiement après création :", paymentIntent);
            res.json({ status: 200, client_secret: paymentIntent.client_secret, payment_intent_id: paymentIntent.id });
        } catch (err) {
            console.error("Erreur lors de l'exécution du paiement :", err);
            res.json({ status: 500, msg: "Le paiement ne peut pas être vérifié!", error: err.message });
        }
    };

    const updatePaymentStatus = async (req, res) => {
        try {
            const validate = await OrderModel.updateStatus(req.body.orderId, req.body.status);
            if (validate.code) {
                return res.json({ status: 500, msg: "Le status de paiement de la commande ne peut pas être modifié!" });
            }

            res.json({ status: 200, msg: "Status mis à jour!" });
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut de paiement :", err);
            res.json({ status: 500, msg: "Le status de paiement de la commande ne peut pas être modifié!" });
        }
    };

    const getAllOrder = async (req, res) => {
        try {
            const orders = await OrderModel.getAllOrders();
            if (orders.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            }
            res.json({ status: 200, result: orders });
        } catch (err) {
            console.error("Erreur lors de la récupération des commandes :", err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    };

    const getOneOrder = async (req, res) => {
        try {
            const order = await OrderModel.getOneOrder(req.params.id);
            if (order.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            }

            const user = await UserModel.getOneUser(order[0].users_id);
            if (user.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            }

            const myUser = {
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                adress: user[0].adress,
                zip: user[0].zip,
                city: user[0].city,
                phone: user[0].phone
            };

            const details = await OrderModel.getAllDetails(req.params.id);
            if (details.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            }

            res.json({ status: 200, order: order[0], user: myUser, orderDetail: details });
        } catch (err) {
            console.error("Erreur lors de la récupération d'une commande :", err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    };

    return {
        saveOrder,
        executePayment,
        updatePaymentStatus,
        getAllOrder,
        getOneOrder
    };
};
