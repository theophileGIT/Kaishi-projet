module.exports = (ContactsModel) => {
    const saveContact = async (req, res) => {
        try {
            const contact = {
                email: req.body.email,
                content: req.body.content
            };

            const result = await ContactsModel.saveContact(contact);

            if (result.code && result.code === 500) {
                res.status(500).json({ status: 500, msg: "Une erreur est survenue lors de l'enregistrement" });
            } else {
                res.status(200).json({ status: 200, msg: "Message envoyé avec succès" });
            }
        } catch (err) {
            res.status(500).json({ status: 500, msg: "Une erreur est survenue" });
        }
    };

    return {
        saveContact
    };
};