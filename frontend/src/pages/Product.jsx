import { useState, useEffect, useRef } from 'react'; // Ajout de useRef et useEffect
import { useSelector } from 'react-redux';
import { selectMatcha } from '../slices/matchaSlice';
import ArticleDetail from '../components/Article-product';
import covermatcha from '../assets/images/cover-matcha.png';
import matchacannette from '../assets/images/matcha-home.jpg';
import { Link } from "react-router-dom";

const Product = (props) => {
    const produits = useSelector(selectMatcha);

    if (!produits || !produits.products) {
        return <div>Aucun produit disponible</div>;
    }

    const produitsFiltres = produits.products.filter((product) => product.id < 7);

    return (
        <section id="product1">
            <div>
                <img src={covermatcha} alt="Matcha 1" />
                <div className="cover-text">
                    Matcha
                </div>
            </div>
            {produitsFiltres.length > 0 ? (
                 <ul>
                 {produitsFiltres.map((product) => (
                     <ArticleDetail key={product.id} prod={product} />
                 ))}
             </ul>
            ) : (
                <p>Aucun produit trouvé</p>
            )}
            <div id="infos">
                <div>
                    <h1>Pourquoi Kaishi Matcha?</h1>
                    <p>
                        Kaishi Matcha représente un rêve devenu réalité pour moi. Le matcha a toujours été présent dans mon quotidien, transmis par ma mère depuis mon enfance : c’est un produit que j'ai appris à connaître et qui me passionne.

                        Après avoir testé des dizaines de matchas au fil des années, j'ai ressenti le besoin de créer ma propre recette. Cherchant à apporter ma touche personnelle, j'ai choisi pour vous un matcha d’une qualité exceptionnelle, sans aucune amertume et ainsi vous transmettre mon amour du matcha.

                        Timea, La fondatrice.
                    </p>
                    <button>
                        <Link to="/story">Découvrir notre histoire</Link>
                    </button>
                </div>
                <div>
                    <img src={matchacannette} alt="affiche-Kaishi" />
                </div>
            </div>
        </section>
    );
}

export default Product;
