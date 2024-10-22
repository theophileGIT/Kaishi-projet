import { Link } from "react-router-dom";
import Champ from "../assets/images/champ-matcha.jpg";
import Affiche from "../assets/images/kaishi-pub.jpg";
import Signature from "../assets/images/signature-kaishi.png";
import Menu from "../assets/images/carte-menu.jpg";

const Story = () => {
    return (
        <div id='our-story'>
            <section>
                <article>
                    <img src={Champ} alt="affiche-Kaishi" />
                    <h3>Notre histoire</h3>
                    <p>UN MOT DE TIMEA, NOTRE FONDATRICE <br></br>

                        "Kaishi Matcha représente un rêve devenu réalité pour moi. Le matcha a toujours été présent dans mon quotidien, transmis par ma mère depuis mon enfance: c’est un produit que j'ai appris à connaître et qui me passionne.<br></br>

                        Après avoir testé des dizaines de matchas au fil des années, j'ai ressenti le besoin de créer ma propre recette. Cherchant à apporter ma touche personnelle, j'ai choisi pour vous un matcha d’une qualité exceptionnelle, sans aucune amertume et ainsi vous transmettre mon amour du matcha."
                        </p>
                        <img src={Signature} alt="signature-Kaishi" />
                </article>

            </section>

            <section>
                <article>
                    <h1>Depuis l'enfance</h1>
                    <p>
                        Timea, 32 ans, a passé plusieurs années au Japon pour explorer le matcha. De retour en France après tout ce temps, il souhaite ouvrir un bar à matcha dans le cœur de Marseille dans le quartier de Noailles, proposant son propre matcha. Il choisit de nommer son bar «Kaishi», en référence aux feuilles de papier pliées utilisées pour diverses fonctions  durant la cérémonie du thé japonaise.
                    </p>

                </article>

                <article>
                    <img src={Affiche} alt="affiche-Kaishi" />
                </article>
            </section>

            <section>

                <article>
                    <img src={Menu} alt="menu-Kaishi" />

                </article>

                <article>
                    <h1>Notre savoir faire</h1>
                    <p>
                        Amateur, passionné ou simplement curieux, venez découvrir un univers où le matcha devient une source d’inspiration et de bien-être.
                        Il veut créer un espace où l’on célèbre le matcha sous toutes ses formes, tout en brisant les barrières des règles esthétiques et des clichés associés. Avec un lieu qui offre une expérience immersive où vous pouvez savourer et déguster le matcha d’une manière nouvelle et accessible à tous. Amateur, passionné ou simplement curieux, venez découvrir un univers où le matcha devient une source d’inspiration et de bien-être.
                    </p>
                </article>
            </section>



        </div>
    )
}

export default Story