import React, { useState } from 'react';
import { addOneContact } from "../api/contact"; 
const Contact = () => {

    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!email || !content) {
            setError('Email et contenu sont obligatoires.');
            setLoading(false);
            return;
        }

        // Création de l'objet à envoyer à l'API
        const contactData = {
            email: email,
            content: content
        };

        // Appel à l'API
        try {
            const response = await addOneContact(contactData);
            if (response.status === 200) {
                setSuccess('Message envoyé avec succès');
            } else {
                setError("Une erreur est survenue lors de l'envoi du message");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion à l'API");
        }

        setLoading(false);
    };

    return (
        <div id="contact-page">
            <h2>Contactez-nous</h2>
            <form onSubmit={handleSubmit}>
                <div >
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Votre message :</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                {loading ? <p>Envoi en cours...</p> : <button type="submit">Envoyer</button>}
            </form>

            {error && <p >{error}</p>}
            {success && <p >{success}</p>}
        </div>
    );
};

export default Contact;
