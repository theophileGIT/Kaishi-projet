import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { loadMatcha } from "../../../slices/matchaSlice";
import { Navigate } from "react-router-dom";
import { addOneProduct, displayProducts } from "../../../api/products";
import axios from "axios";
import { config } from "../../../config";

const AddProduct = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [selectedFile, setFile] = useState(null);
    const [selectedHoverFile, setHoverFile] = useState(null); // État pour le fichier de survol
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // État de chargement


    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post(`${config.apiUrl}/products/savePicture`, formData);
            return res.data.url;
        } catch (err) {
            setError("Erreur lors du téléchargement de l'image.");
            return null;
        }
    };

    const addProduct = (datas) => {
        addOneProduct(datas)
            .then((res) => {
                if (res.status === 200) {
                    displayProducts().then((response) => {
                        if (response.status === 200) {
                            dispatch(loadMatcha(response.result));
                            setRedirect(true);
                        }
                    }).catch((err) => console.log(err));
                } else {
                    console.log(res);
                }
            })
            .catch((err) => console.log(err));
    };

    const saveCompleProduct = () => {
        const formData = new FormData();
        formData.append("picture", selectedFile);
        if (selectedHoverFile) {
            formData.append("hoverPicture", selectedHoverFile); 
        }
    
        setLoading(true); // Commencer le chargement

        axios({
            method: "post",
            url: `${config.api_url}/api/v1/product/pict`,
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
                "x-access-token": user.infos.token
            }
        })
        .then((res) => {
            setLoading(false); // Fin du chargement
            if (res.status === 200) {
                const datas = {
                    name,
                    description,
                    price,
                    picture: res.data.url, 
                    hoverPicture: res.data.hoverurl,
                    quantity,
                };
                addProduct(datas);
            } else {
                setError("Erreur lors du téléchargement de l'image!!");
            }
        })
        .catch((err) => {
            setLoading(false); // Fin du chargement
            console.log(err);
            setError("Erreur lors du téléchargement de l'image");
        });
    };
    
    const onSubmitForm = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        
        if (!trimmedName || !trimmedDescription || !price || !quantity) {
            setError("Tous les champs ne sont pas encore remplis !");
        } else if (isNaN(quantity) || isNaN(price)) {
            setError("Les champs prix et quantité doivent être des chiffres !");
        } else if (parseFloat(quantity) < 1) {
            setError("La quantité doit être au moins 1 !");
        } else if (parseFloat(price) <= 0) {
            setError("Le prix doit être supérieur à 0 !");
        } else {
            saveCompleProduct();
        }
    };

    if (redirect) {
        return <Navigate to="/admin" />;
    }

    return (
        <section id="addProduct">
            <h2>Ajouter un produit</h2>
            {error && <p className="error">{error}</p>}
            {loading && <p>Chargement en cours...</p>}
            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    placeholder="Nom du produit"
                    value={name}
                    onChange={({ currentTarget }) => setName(currentTarget.value)}
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.currentTarget.files[0])}
                />
                <input
                    type="file"
                    onChange={(e) => setHoverFile(e.currentTarget.files[0])} // Fichier de survol
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={({ currentTarget }) => setDescription(currentTarget.value)}
                ></textarea>
                <input
                    type="text"
                    placeholder="Quantité disponible"
                    value={quantity}
                    onChange={({ currentTarget }) => setQuantity(currentTarget.value)}
                />
                <input
                    type="text"
                    placeholder="Prix de vente"
                    value={price}
                    onChange={({ currentTarget }) => setPrice(currentTarget.value)}
                />
                <button type="submit" disabled={loading}>Enregistrer</button>
            </form>
        </section>
    );
};

export default AddProduct;
