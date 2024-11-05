const stripe = require('stripe')('sk_test_51PnH0ZP5fWes0UWvFuIHlcD84KALFosfMjaTFjQsEAWJUe2PtV6Kz1VS3OAPjtPGh0RwxDYcSre0SsF3Lr0FHkqn00hGE9uzle');

module.exports = (ProductModel, OrderModel, UserModel) => {
    const saveOrder = async (req, res) => {
        try {
            console.log("Démarrage de la sauvegarde de la commande");
            let total_amount = 0;

            if (!req.body.basket || req.body.basket.length === 0) {
                return res.status(400).json({ status: 400, msg: "Le panier est vide." });
            }

            if (!req.body.user_id) {
                return res.status(400).json({ status: 400, msg: "user_id est manquant." });
            }

            const orderPromises = req.body.basket.map(async (b) => {
                const product = await ProductModel.getOneProduct(b.id);
                if (!product || product.code) {
                    throw new Error(`Produit introuvable pour l'ID ${b.id}`);
                }
                console.log("Produit récupéré :", product);

                b.safePrice = parseFloat(product[0].price);
                total_amount += parseInt(b.quantityInCart) * b.safePrice;
            });

            await Promise.all(orderPromises);
            console.log("Montant total calculé:", total_amount);

            if (total_amount <= 0) {
                return res.status(400).json({ status: 400, msg: "Le montant total doit être supérieur à zéro." });
            }

            const orderInfos = await OrderModel.saveOneOrder(req.body.user_id, total_amount);
            console.log("Infos de commande sauvegardées :", orderInfos);
            if (orderInfos.code) {
                return res.status(500).json({ status: 500, msg: "Échec de l'enregistrement de la commande!" });
            }

            const orderId = orderInfos.insertId;
            console.log("ID de commande généré :", orderId);

            const detailPromises = req.body.basket.map(async (b) => {
                const detail = await OrderModel.saveOneOrderDetail(orderId, b);
                console.log("Détail de commande sauvegardé pour le produit :", b);
                if (detail.code) {
                    throw new Error("Échec lors de la sauvegarde des détails de la commande");
                }
            });
            await Promise.all(detailPromises);

            await OrderModel.updateTotalAmount(orderId, total_amount);
            console.log("Montant total mis à jour dans la commande :", total_amount);

            res.status(200).json({ status: 200, orderId });
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la commande :", err.message);
            res.status(500).json({ status: 500, msg: "Échec enregistrement de la commande!", error: err.message });
        }
    };

    const executePayment = async (req, res) => {
        try {
            console.log("Exécution du paiement pour l'ID de commande :", req.body.orderId);
            const order = await OrderModel.getOneOrder(req.body.orderId);
            if (order.code) {
                return res.json({ status: 500, msg: "Le paiement ne peut pas être vérifié!" });
            }

            console.log("Commande récupérée pour le paiement :", order);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: order[0].total_amount * 100,
                currency: 'eur',
                metadata: { integration_check: 'accept_a_payment' },
                receipt_email: req.body.email
            });

            console.log("Payment Intent créé :", paymentIntent);
            res.json({ status: 200, client_secret: paymentIntent.client_secret, payment_intent_id: paymentIntent.id });
        } catch (err) {
            console.error("Erreur lors de l'exécution du paiement :", err);
            res.status(500).json({ status: 500, msg: "Le paiement ne peut pas être vérifié!", error: err.message });
        }
    };

    const updatePaymentStatus = async (req, res) => {
        try {
            console.log("Mise à jour du statut de paiement pour l'ID de commande :", req.body.orderId);
            const validate = await OrderModel.updateStatus(req.body.orderId, req.body.status);
            if (validate.code) {
                return res.status(500).json({ status: 500, msg: "Le statut de paiement de la commande ne peut pas être modifié!" });
            }

            console.log("Statut de paiement mis à jour :", req.body.status);
            res.json({ status: 200, msg: "Status mis à jour!" });
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut de paiement :", err);
            res.status(500).json({ status: 500, msg: "Le statut de paiement de la commande ne peut pas être modifié!" });
        }
    };

    const getAllOrder = async (req, res) => {
        try {
            console.log("Récupération de toutes les commandes");
            const orders = await OrderModel.getAllOrders();
            if (orders.code) {
                return res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
            }
            console.log("Commandes récupérées :", orders);
            res.json({ status: 200, result: orders });
        } catch (err) {
            console.error("Erreur lors de la récupération des commandes :", err);
            res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
        }
    };

    const getOneOrder = async (req, res) => {
        try {
            console.log("Récupération de la commande pour l'ID :", req.params.id);
            const order = await OrderModel.getOneOrder(req.params.id);
            if (order.code) {
                return res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
            }

            console.log("Commande récupérée :", order);
            const user = await UserModel.getOneUser(order[0].users_id);
            if (user.code) {
                return res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
            }

            const myUser = {
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                adress: user[0].adress,
                zip: user[0].zip,
                city: user[0].city,
                phone: user[0].phone
            };
            console.log("Utilisateur associé récupéré :", myUser);

            const details = await OrderModel.getAllDetails(req.params.id);
            if (details.code) {
                return res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
            }

            console.log("Détails de la commande récupérés :", details);
            res.json({ status: 200, order: order[0], user: myUser, orderDetail: details });
        } catch (err) {
            console.error("Erreur lors de la récupération d'une commande :", err);
            res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
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
