module.exports = (UserModel) => {
    const checkToken = async (req, res) => {
        try {
            const user = await UserModel.getOneUser(req.id)
            if(user.code){
                res.json({status: 500, msg: "Une erreur est survenue"})
            } else {
                const myUser = {
                    id: user[0].id,
                    firstname: user[0].firstname,
                    lastname: user[0].lastname,
                    email: user[0].email,
                    adress: user[0].adress,
                    zip: user[0].zip,
                    city: user[0].city,
                    phone: user[0].phone,
                    role: user[0].role
                }
                res.json({status: 200, user: myUser})
            }
        } catch(err) {
            res.json({status: 500, msg: "Une erreur est survenue"})
        }
    }
    return {
        checkToken
    }
}