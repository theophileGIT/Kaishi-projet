const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = 'fsjs38';

module.exports = (UserModel) => {
    const saveUser = async (req, res) => {
        try {
            console.log("Request Body:", req.body);
            // Valider les champs requis
            const { firstname, lastname, email, password, adress, zip, city, phone } = req.body; // Utilisation de 'adress'
            if (!firstname || !lastname || !email || !password || !adress || !zip || !city || !phone) {
                return res.json({ status: 400, msg: "Tous les champs sont obligatoires!" });
            }

            // Vérifier si un utilisateur dans la bdd possède un compte pour cet email
            const check = await UserModel.getUserByEmail(email);
            if (check.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue lors de la vérification de l'email." });
            }

            // Vérifier si l'email existe déjà
            if (check.length > 0) {
                return res.json({ status: 401, msg: "Vous ne pouvez pas créer de compte avec ces identifiants!" });
            }

            // Hacher le mot de passe avant de l'enregistrer
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'objet utilisateur à enregistrer
            const newUser = {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                adress, // Utilisation de 'adress'
                zip,
                city,
                phone,
                role: 'user', // Attribuer un rôle par défaut
                created_at: new Date() // Ajouter le champ de date de création
            };

            // Enregistrer l'utilisateur dans la base de données
            const user = await UserModel.saveOneUser(req); // Passer 'req' directement
            if (user.code) {
                console.log('USER', user);
                return res.json({ status: 500, msg: "Une erreur est survenue lors de l'enregistrement de l'utilisateur." });
            }

            res.json({ status: 200, msg: "L'utilisateur a bien été enregistré!" });
        } catch (err) {
            console.error(err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    }

    const loginUser = async (req, res) => {
        try {
            // Vérifier si un utilisateur dans la bdd possède un compte pour cet email
            const check = await UserModel.getUserByEmail(req.body.email);
            if (check.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            }

            // Si aucun utilisateur n'existe pour cet email
            if (check.length === 0) {
                return res.json({ status: 404, msg: "Utilisateur introuvable!" });
            }

            // Comparer les mots de passe
            const same = await bcrypt.compare(req.body.password, check[0].password);
            if (same) {
                // Créer le payload pour le token
                const payload = { id: check[0].id, role: check[0].role };
                const token = jwt.sign(payload, secret);

                // Mettre à jour la date de la dernière connexion
                const connect = await UserModel.updateConnexion(check[0].id);
                if (connect.code) {
                    return res.json({ status: 500, msg: "Une erreur est survenue" });
                } else {
                    const user = {
                        id: check[0].id,
                        firstname: check[0].firstname,
                        lastname: check[0].lastname,
                        email: check[0].email,
                        adress: check[0].adress, // Utilisation de 'adress'
                        zip: check[0].zip,
                        city: check[0].city,
                        phone: check[0].phone,
                        role: check[0].role
                    };
                    res.json({ status: 200, token: token, user: user });
                }
            } else {
                return res.json({ status: 404, msg: "Mot de passe incorrect!" });
            }
        } catch (err) {
            console.error(err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    }

    const updateUser = async (req, res) => {
        try {
            const user = await UserModel.updateUser(req, req.params.id);
            if (user.code) {
                return res.json({ status: 500, msg: "Erreur mise à jour de l'utilisateur." });
            } else {
                // Renvoyer les infos de mise à jour vers le front
                const newUser = await UserModel.getOneUser(req.params.id);
                if (newUser.code) {
                    return res.json({ status: 500, msg: "Une erreur est survenue" });
                } else {
                    const myUser = {
                        id: newUser[0].id,
                        firstname: newUser[0].firstname,
                        lastname: newUser[0].lastname,
                        email: newUser[0].email,
                        adress: newUser[0].adress, // Utilisation de 'adress'
                        zip: newUser[0].zip,
                        city: newUser[0].city,
                        phone: newUser[0].phone,
                        role: newUser[0].role
                    };
                    res.json({ status: 200, msg: "Utilisateur modifié!", newUser: myUser });
                }
            }
        } catch (err) {
            console.error(err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    }

    const deleteUser = async (req, res) => {
        try {
            const deleteUser = await UserModel.deleteOneUser(req.params.id);
            if (deleteUser.code) {
                return res.json({ status: 500, msg: "Une erreur est survenue" });
            } else {
                res.json({ status: 200, msg: "Utilisateur supprimé!" });
            }
        } catch (err) {
            console.error(err);
            res.json({ status: 500, msg: "Une erreur est survenue" });
        }
    }

    return {
        saveUser,
        loginUser,
        updateUser,
        deleteUser
    }
}
