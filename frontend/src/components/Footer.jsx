import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
    return (
        <footer>

            <section id='infoMore'>
                <div>
                    <h3>ADRESSE</h3>
                    <ul>
                        <li>41 rue d'Aubagne</li>
                        <li>13001 Marseille</li>
                    </ul>
                </div>

                <div>
                    <h3>HORAIRES</h3>
                    <ul>
                        <li>Ouvert tous les jours</li>
                        <li>de 11:00 à 20:00</li>
                    </ul>
                </div>

                <div>
                    <h3>SUIVEZ-NOUS</h3>
                    <ul>
                        <li> <FontAwesomeIcon icon={faFacebook} />  <FontAwesomeIcon icon={faInstagram} />  </li>

                    </ul>

                </div>

                <div>
                    <h3>FORMULAIRE</h3>
                    <ul>
                        <li>
                            <Link to="/contact">
                                <button>Contact</button>
                            </Link>
                        </li>
                    </ul>
                </div>


            </section>
        </footer >
    )
}

export default Footer