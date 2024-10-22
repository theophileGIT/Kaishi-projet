import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { config } from "../config";
import SFGFV from "../assets/images/3logos.png";
import video1 from '../assets/images/video1-matcha.mp4';
import video2 from '../assets/images/video2-matcha.mp4';
import video3 from '../assets/images/video3-matcha.mp4';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { takeOneProduct } from "../api/products";
import { useSelector, useDispatch } from "react-redux";
import { selectBasket, modifyBasket } from "../slices/basketSlice";
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';

const Detail = () => {
    const { id } = useParams();
    const basket = useSelector(selectBasket);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showPreparation, setShowPreparation] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);

    const onClickBasket = (newProduct) => {
        if (!newProduct) return;

        const myQuantity = parseInt(quantity, 10);

        if (isNaN(myQuantity) || myQuantity <= 0) {
            setError("Veuillez saisir un nombre positif");
            return;
        }

        setError(null);
        const newBasket = [...basket.basket];
        const productIndex = newBasket.findIndex((item) => item.id === newProduct.id);

        if (productIndex === -1) {
            newBasket.push({ ...newProduct, quantityInCart: myQuantity });
        } else {
            newBasket[productIndex].quantityInCart += myQuantity;
        }

        const updatedBasket = JSON.stringify(newBasket);
        window.localStorage.setItem("kaishi-basket", updatedBasket);
        dispatch(modifyBasket(newBasket));
    };

    useEffect(() => {
        takeOneProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.result);
                } else {
                    console.error("Erreur: produit non trouvé");
                    setProduct(null);
                }
            })
            .catch((err) => {
                console.error("Erreur de récupération du produit:", err);
                setProduct(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <section id="detail-product">
            {product && product.picture ? (
                <>
                    <div>
                        <img
                            src={config.pict_url + product.picture}
                            alt={`image du produit ${product.name}`}
                        />
                    </div>

                    <div>
                        <article>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                        </article>

                        <article>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onClickBasket(product);
                                }}>
                                <label>
                                    Quantité:
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.currentTarget.value)}
                                    />
                                </label>
                                <button type="submit">
                                    AJOdTER AU PANIER · {product.price} €
                                </button>
                            </form>
                        </article>

                        <article>
                            <p onClick={() => setShowIngredients(!showIngredients)}>
                                INGRÉDIENTS <FontAwesomeIcon icon={showIngredients ? faCircleChevronUp : faCircleChevronDown} />
                            </p>
                            {showIngredients && (
                                <p>100% thé matcha Okumidori.</p>
                            )}
                        </article>

                        <article>
                            <p onClick={() => setShowPreparation(!showPreparation)}>
                                COMMENT PRÉPARER SON MATCHA <FontAwesomeIcon icon={showPreparation ? faCircleChevronUp : faCircleChevronDown} />
                            </p>
                            {showPreparation && (
                                <p>
                                    Le matcha Milia Matcha fraise se consomme chaud ou froid selon vos envies.
                                    Il peut également être préparé en latté, avec votre lait préféré.<br /><br />
                                    L'équipe Milia Matcha vous recommande d'utiliser un lait végétal pour une consommation
                                    quotidienne (petite préférence pour le lait d'amande et lait d'avoine!) mais votre lait
                                    préféré conviendra parfaitement.<br /><br />
                                    Pour conserver un maximum les saveurs et les bienfaits de votre matcha, nous vous recommandons
                                    de le consommer jusqu'à 4 mois après ouverture. À conserver dans un endroit frais et sec.
                                </p>
                            )}
                        </article>

                        <article>
                            <p onClick={() => setShowDelivery(!showDelivery)}>
                                LIVRAISON <FontAwesomeIcon icon={showDelivery ? faCircleChevronUp : faCircleChevronDown} />
                            </p>
                            {showDelivery && (
                                <p>
                                    Toutes les commandes passées avant 13h seront expédiées le jour même. Le choix du point relais s’effectue après votre paiement sur notre site ou par e-mail.<br /><br />
                                    France :<br /><br />
                                    Livraison standard à domicile en 2-3 jours ouvrés 4,49 €<br /><br />
                                    Livraison en point relais en 3-4 jours ouvrés à 4,49 €<br /><br />
                                    Livraison express à domicile en 1-2 jours ouvrés 12,99 €<br /><br />
                                    Les livraisons standard & en points relais sont offertes à partir de 49 €.
                                </p>
                            )}
                        </article>

                        <article>
                            <img src={SFGFV} alt="logo-sans-sucre-logo-sans-gluten-logo-vegan" />
                        </article>
                    </div>

                </>
            ) : (
                <p>Produit non trouvé ou erreur de chargement.</p>
            )
            }
        </section >
    );
};

export default Detail;
