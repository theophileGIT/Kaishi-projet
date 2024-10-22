import { useState } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectBasket, modifyBasket } from "../slices/basketSlice";

// Composant de carte d'un produit
const ArticleDetail = (props) => {
  const basket = useSelector(selectBasket);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const onClickBasket = (oldBasket, newProduct) => {
    let myQuantity = parseInt(quantity);

    if (isNaN(myQuantity) || myQuantity <= 0) {
      setError("Veuillez saisir un nombre positif svp!");
      return;
    }

    setError(null);
    let newBasket = JSON.parse(JSON.stringify(oldBasket));
    const same = newBasket.findIndex((b) => b.id === newProduct.id);

    if (same === -1) {
      let myProduct = JSON.parse(JSON.stringify(newProduct));
      myProduct.quantityInCart = myQuantity;
      newBasket = [...newBasket, myProduct];
    } else {
      newBasket[same].quantityInCart += myQuantity;
    }

    // Mettre à jour le panier dans le localStorage et dans Redux
    window.localStorage.setItem("kaishi-basket", JSON.stringify(newBasket));
    dispatch(modifyBasket(newBasket));
  };

  return (
    <main>
      <section>
        <div id="article-detail">
          <div
            className="image-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to={`/detail/${props.prod.id}`}>
              <img
                // Change d'image en fonction du survol
                src={isHovered ? config.pict_url + props.prod.hoverPicture : config.pict_url + props.prod.picture}
                alt={`image du produit ${props.prod.name}`}
              />
            </Link>
            {isHovered && (
              <button type="button" onClick={() => onClickBasket(basket.basket, props.prod)}>
                + Ajouter
              </button>
            )}
          </div>
          <div className="product-info">
            <p className="product-title">{props.prod.name}</p>
            <p className="product-price">{props.prod.price} €</p>
          </div>
        </div>
      </section>
    </main>

  );
};

export default ArticleDetail;
