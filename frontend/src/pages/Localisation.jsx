import React from 'react';
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Bar from "../assets/images/affiche-kaishi.jpg";

const LATITUDE = 43.295012;
const LONGITUDE = 5.380232;

const LocationMap = () => {
    return (
        <div id="location">

            <section>
            <img src={Bar} alt="bar-Kaishi" />
            <h3>Notre bar</h3>
            </section>

            <section>
                <h2> Kaishi café ouvre ses portes </h2>
                <p>  Ce quartier vibrant et multiculturel offre un accès direct à une clientèle diversifiée, attirée par son ambiance authentique et son dynamisme. Le quartier est également en pleine transformation, avec des investissements croissants qui créent des opportunités de croissance et de visibilité.L’environnement collaboratif et le réseau local actif sont des atouts précieux pour développer des partenariats et s’intégrer dans la communauté marseillaise.Il veut créer un espace où l’on célèbre le matcha sous toutes ses formes, tout en brisant les barrières des règles esthétiques et des clichés associés. Avec un lieu qui offre une expérience immersive où vous pouvez savourer et déguster le matcha d’une manière nouvelle et accessible à tous. </p>
                <button>
                    <Link to="/product">Shop now</Link>
                </button>
            </section>

            <section>
                <article>
                    <h2>Horaires d'ouverture</h2>
                    <p>Ouvert tous les jours <br />
                        sur réservation <br />
                        11:00h à 20:00h <br />
                        7/7 service continu <br />
                        Téléphone : 03 12 34 56 78
                    </p>
                </article>
                <MapContainer
                    center={[LATITUDE, LONGITUDE]}
                    zoom={13}
                    style={{ height: '500px', width: '50%' }} >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                    <Marker position={[LATITUDE, LONGITUDE]}>
                        <Popup>
                            Adresse Spécifique
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>

        </div>
    );
};

export default LocationMap;
