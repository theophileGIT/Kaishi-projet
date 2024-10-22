module.exports = (_db) => {
    return {
        saveContact: async (contact) => {
            if (!contact.email || !contact.content) {
                return { code: 400, message: "Email et contenu sont obligatoires." };
            }
            try {
                const result = await _db.query(
                    "INSERT INTO contacts (email, content) VALUES (?, ?)",
                    [contact.email, contact.content]
                );
                return result;
            } catch (error) {
                console.error("Une erreur est survenue:", error);
                return { code: 500, message: "Database error" };
            }
        }
    };
};
