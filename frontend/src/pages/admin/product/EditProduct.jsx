import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { loadMatcha } from '../../../slices/matchaSlice';
import { Navigate } from 'react-router-dom';
import { takeOneProduct, updateOneProduct, displayProducts } from '../../../api/products';
import axios from 'axios';
import { config } from '../../../config';

const EditProduct = (props) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [selectedFile, setFile] = useState(null);
    const [selectedHoverFile, setHoverFile] = useState(null); // État pour le fichier d'image de survol
    const [oldPict, setOldPict] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // État pour le chargement

    
    const addProd = (datas) => {
        updateOneProduct(datas, props.params.id)
            .then((res) => {
                if (res.status === 200) {
                    displayProducts()
                        .then((response) => {
                            if (response.status === 200) {
                                dispatch(loadMatcha(response.result));
                                setRedirect(true);
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    };

    const saveCompleProduct = () => {
        const formData = new FormData();
        formData.append("picture", selectedFile);

        if (selectedHoverFile) {
            formData.append("hoverPicture", selectedHoverFile); // Ajout de l'image de survol
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
                    hoverPicture: res.data.hoverurl, // Récupération de l'URL de l'image de survol
                    quantity,
                };
                addProd(datas); // Envoi des données
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
        setError(null);

        if (name === "" || description === "" || price === "" || quantity === "") {
            setError("Tous les champs ne sont pas remplis!");
        } else if (isNaN(quantity) || isNaN(price)) {
            setError("Les champs prix et quantité doivent obligatoirement être un chiffre!");
        } else {
            saveCompleProduct(); // Appel de la fonction pour enregistrer le produit
        }
    };

    useEffect(() => {
        takeOneProduct(props.params.id)
            .then((res) => {
                setName(res.result.name);
                setDescription(res.result.description);
                setQuantity(res.result.quantity);
                setOldPict(res.result.picture);
                setPrice(res.result.price);
            })
            .catch(err => console.log(err));
    }, []);

    if (redirect) {
        return <Navigate to="/admin" />;
    }

    return (
        <section id="edditProduct">
            <h2>Modifier un produit</h2>
            {error !== null && <p>{error}</p>}
            <form className="b-form" onSubmit={onSubmitForm}>
                <input
                    type="text"
                    placeholder="Nom du produit"
                    defaultValue={name}
                    onChange={(e) => {
                        setName(e.currentTarget.value);
                    }}
                />
                <input
                    type="file"
                    onChange={(e) => {
                        setFile(e.currentTarget.files[0]);
                    }}
                />
                <input
                    type="file"
                    onChange={(e) => {
                        setHoverFile(e.currentTarget.files[0]); // Met à jour l'état pour le fichier d'image de survol
                    }}
                />
                <textarea
                    name="description"
                    defaultValue={description}
                    onChange={(e) => {
                        setDescription(e.currentTarget.value);
                    }}
                ></textarea>
                <input
                    type="text"
                    defaultValue={quantity}
                    placeholder="Quantité disponible"
                    onChange={(e) => {
                        setQuantity(e.currentTarget.value);
                    }}
                />
                <input
                    type="text"
                    defaultValue={price}
                    placeholder="Prix de vente"
                    onChange={(e) => {
                        setPrice(e.currentTarget.value);
                    }}
                />
                <button>Enregistrer</button>
            </form>
            {oldPict !== null && <img src={config.pict_url + oldPict} alt="image actuelle" />}
        </section>
    );
};

export default EditProduct;
