import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectMatcha } from '../slices/matchaSlice'; 
import matcha1 from '../assets/images/box-kaishi.jpg';
import matchacannette from '../assets/images/matcha-home.jpg';
import video from '../assets/images/video-matcha.mp4';
import ArticleDetail from '../components/Article-product';
import { Link } from "react-router-dom";

const Home = (props) => {
    const produits = useSelector(selectMatcha);
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoElement.play(); // Lancer la vidéo
                } else {
                    videoElement.pause(); // Mettre en pause la vidéo
                }
            });
        });
        if (videoElement) {
            observer.observe(videoElement);
        }
        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, []);

    return (
        <main>
            <section id="cover">
                <div className="cover-container">
                    <img src={matcha1} alt="Matcha 1" className="carousel-image" />
                    <div className="cover-text">
                        Shop All
                    </div>
                </div>
            </section>

            <section id="products">
                {produits && produits.products && produits.products.length > 0 ? (
                    <ul>
                        {produits.products.map((b) => (
                            <ArticleDetail key={b.id} prod={b} />
                        ))}
                    </ul>
                ) : (
                    <p>Aucun produit trouvé</p>
                )}
            </section>

            <section id="infos">
                <div>
                    <h1>Pourquoi Kaishi Matcha?</h1>
                    <p>
                        Kaishi Matcha représente un rêve devenu réalité pour moi. Le matcha a toujours été présent dans mon quotidien, transmis par ma mère depuis mon enfance: c’est un produit que j'ai appris à connaître et qui me passionne.

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
            </section>

            <section id="video">
                <video ref={videoRef} controls width="100%" muted>
                    <source src={video} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                </video>
            </section>
        </main>
    );
}

export default Home;
