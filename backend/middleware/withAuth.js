const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const withAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    
    if (!token) {
        return res.status(404).json({ status: 404, msg: "Non autorisé" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, msg: "Non autorisé" });
        }

        req.id = decoded.id;
        next();
    });
};

module.exports = withAuth;
