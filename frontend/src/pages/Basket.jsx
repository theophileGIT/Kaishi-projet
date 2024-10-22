import { useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../slices/userSlice';
import { selectBasket, modifyBasket, cleanBasket } from '../slices/basketSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCalendarCheck, faTruckFast, faLock } from '@fortawesome/free-solid-svg-icons';
import { saveOneOrder } from '../api/order';
import { config } from '../config';

const Basket = (props) => {
    const basket = useSelector(selectBasket);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [redirect, setRedirect] = useState(false);
    const [redirect2, setRedirect2] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mise à jour du localStorage et du state Redux
    const updateBasketInLocalStorage = (newBasket) => {
        let lsBasket = JSON.stringify(newBasket);
        window.localStorage.setItem("kaishi-basket", lsBasket);
        dispatch(modifyBasket(newBasket));
    };

    // Enregistre une commande et envoie vers le boîtier de paiement
    const onClickSaveOrder = (e) => {
        e.preventDefault();
        setLoading(true); // Activer l'état de chargement

        if (user.isLogged) {
            const datas = {
                user_id: user.infos.id,
                basket: basket.basket
            };
            saveOneOrder(datas)
                .then((res) => {
                    setLoading(false); // Désactiver l'état de chargement
                    if (res.status === 200) {
                        setOrderId(res.orderId);
                        setRedirect(true);
                    } else {
                        console.log(res);
                        alert("Une erreur est survenue lors de la validation de la commande.");
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                    alert("Erreur réseau. Veuillez réessayer.");
                });
        } else {
            setRedirect2(true);
        }
    };

    // Supprime un produit du panier
    const removeToBasket = (oldBasket, myProduct) => {
        let newBasket = oldBasket.filter(b => b.id !== myProduct.id);
        updateBasketInLocalStorage(newBasket);
    };

    // Ajoute de la quantité sur un produit
    const addQuantity = (oldBasket, myProduct) => {
        let newBasket = JSON.parse(JSON.stringify(oldBasket));
        const same = newBasket.findIndex((nb) => nb.id === myProduct.id);
        if (same !== -1 && newBasket[same].quantityInCart < newBasket[same].quantity) {
            newBasket[same].quantityInCart += 1;
            updateBasketInLocalStorage(newBasket);
        }
    };

    // Supprime de la quantité sur un produit
    const removeQuantity = (oldBasket, myProduct) => {
        let newBasket = JSON.parse(JSON.stringify(oldBasket));
        const same = newBasket.findIndex((nb) => nb.id === myProduct.id);
        if (same !== -1) {
            if (newBasket[same].quantityInCart > 1) {
                newBasket[same].quantityInCart -= 1;
                updateBasketInLocalStorage(newBasket);
            } else {
                removeToBasket(oldBasket, myProduct);
            }
        }
    };

    // Vide le panier
    const vider = () => {
        window.localStorage.removeItem("kaishi-basket");
        dispatch(cleanBasket());
    };

    if (redirect) {
        return <Navigate to={`/payment/${orderId}`} />;
    }
    if (redirect2) {
        return <Navigate to="/login" />;
    }

    // Ajout d'une vérification supplémentaire pour éviter les erreurs d'accès à basket.basket
    if (!basket || !basket.basket || basket.basket.length === 0) {
        return <p>Votre panier est vide</p>; // Message si le panier est vide ou non chargé
    }

    // Calcul du prix total avec gestion d'éventuelles données incorrectes
    const totalPrice = basket.basket.reduce((total, product) => {
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantityInCart) || 0;
        return total + price * quantity;
    }, 0);

    return (
        <section id="basket">

            <div>
            <h2>RÉCAPITULATIF DE MON PANIER</h2> {/* Titre au-dessus de la première div */}
            {basket.basket.length > 0 ? (
                    <table>
                        <tbody>
                            {basket.basket.map((product) => {
                                let total = parseFloat(product.price) * parseInt(product.quantityInCart);
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={config.pict_url + product.picture}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "chemin/vers/image-par-defaut.jpg"; // Image par défaut en cas d'erreur 
                                                }}
                                            />
                                        </td>
                                        <td>{product.quantityInCart}</td>
                                        <td>
                                            <button aria-label="Retirer un article" onClick={() => removeQuantity(basket.basket, product)}>
                                                -
                                            </button>
                                            <button aria-label="Ajouter un article" onClick={() => addQuantity(basket.basket, product)}>
                                                +
                                            </button>
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price} €</td>
                                        <td>{total} €</td>
                                        <td>
                                            <button aria-label="Supprimer cet article" onClick={() => removeToBasket(basket.basket, product)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Votre panier est vide</p>
                )}
            </div>
    
            <div>
                {basket.basket.length > 0 && (
                    <article>
                        <h3>Total:{totalPrice} €</h3>
                        <button onClick={onClickSaveOrder} disabled={loading}>
                            {loading ? 'Validation en cours...' : 'Valider ma commande'}
                        </button>
                    </article>
                )}
                <article>
                    <p> Une question? Contactez-nous au 03 12 34 56 78</p>
                </article>
                <article>
                    <ul>
                        <li><p><FontAwesomeIcon icon={faCalendarCheck} /> Expédié en 24 heures maximum</p></li>
                        <li><p><FontAwesomeIcon icon={faTruckFast} /> Livraison standard dans les meilleurs délais</p></li>
                        <li><p><FontAwesomeIcon icon={faLock} /> Paiement ultra sécurisé</p></li>
                    </ul>
                </article>
            </div>
        </section>
    );
}    

export default Basket;


