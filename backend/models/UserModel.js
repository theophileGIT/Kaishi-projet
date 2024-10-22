const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (_db)=>{
    db=_db
    return UserModel
}

class UserModel {
    //sauvegarde d'un utilisateur
    static saveOneUser(req) {
        //on hash le password
        return bcrypt.hash(req.body.password, saltRounds)
        .then((hash) => {
            //on enregistre dans la BDD (sql)
            return db.query('INSERT INTO users (firstname, lastname, email, password, role, adress, zip, city, phone, created_at) VALUES (?, ?, ?, ?, "user", ?, ?, ?, ?, NOW())', [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.adress, req.body.zip, req.body.city, req.body.phone])
            .then((res)=>{
                return res
            })
            .catch((err) => {
                return err
            })
        })
        .catch(err=>err)
    }
    
    //récupération d'un utilisateur en fonction de son mail
    static getUserByEmail(email){
        return db.query("SELECT * FROM users WHERE email = ?", [email])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération d'un utilisateur par son id
    static getOneUser(id){
        return db.query("SELECT * FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification d'un utilisateur
    static updateUser(req, user_id) {
        return db.query("UPDATE users SET firstname = ?, lastname = ?, adress = ?, zip = ?, city = ?, phone = ? WHERE id = ?", [req.body.firstname, req.body.lastname, req.body.adress, req.body.zip, req.body.city, req.body.phone, user_id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification de la dernière connexion d'un utilisateur
    static updateConnexion(id) {
        return db.query("UPDATE users SET last_connection = NOW() WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //suppression d'un compte utilisateur
    static deleteOneUser(id){
        return db.query("DELETE FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
}