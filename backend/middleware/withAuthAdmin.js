const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const withAuthAdmin = (req, res, next) => {
    // On récupère le token dans l'en-tête HTTP
    const token = req.headers['x-access-token'];
    
    // Si le token est manquant
    if (!token) {
        return res.status(404).json({ status: 404, msg: "Non autorisé" });
    }

    // Si un token est présent, vérification avec jwt.verify
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, msg: "Non autorisé" });
        }
        
        // Vérification du rôle d'administrateur
        if (decoded.role !== "admin") {
            return res.status(403).json({ status: 403, msg: "Accès interdit" });
        }
        
        // Si tout est valide, ajout de l'identifiant à req
        req.id = decoded.id;
        next();
    });
};

module.exports = withAuthAdmin;
