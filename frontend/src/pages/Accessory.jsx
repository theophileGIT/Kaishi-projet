import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectMatcha } from '../slices/matchaSlice';
import ArticleDetail from '../components/Article-product';
import coveraccessory from '../assets/images/coveraccessory.png';
import video from '../assets/images/video2.mp4';

const Product = () => {
    const produits = useSelector(selectMatcha);
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return; 

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            });
        });

        observer.observe(videoElement);

        return () => {
            observer.unobserve(videoElement);
        };
    }, []);

    if (!produits?.products) {
        return <div>Aucun produit disponible</div>;
    }

    const produitsFiltres = produits.products.filter((product) => product.id > 6);

    return (
        <section id="product1">
            <div>
                <img src={coveraccessory} alt="Matcha 1" />
                <div className="cover-text">Accessoires</div>
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
            <div id="video">
                <video ref={videoRef} controls width="100%" muted>
                    <source src={video} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                </video>
            </div>
        </section>
    );
};

export default Product;
