import {loadStripe} from "@stripe/stripe-js"
import CheckoutForm from "../components/Checkout-form"
import {Elements} from "@stripe/react-stripe-js"

const Payment = (props) => {
    //la clé publique de stripe me permet de brancher l'environnement de l'api stripe à mon compte stripe API
    const stripePromise = loadStripe("pk_test_51PnH0ZP5fWes0UWvRYudmzLwIk0pEFJqzkQBS5TiQWRXOY5wt1rnRPJ0UDbqoRmPSIZvSEZSzdFtZvfZk2uToGoB00A8YJSESW")
    return (<section id="payment">
        <h2>Paiement</h2>
        <p>Id de la commande: {props.params.orderId}</p>
        {/*On va brancher l'environnement des fonctionnalitées de react-stripe
            qui va permettre d'effectuer les échanges avec l'api stripe de manière sécurisée
        */}
        <Elements stripe={stripePromise}>
            <CheckoutForm orderId={props.params.orderId} />
        </Elements>
    </section>)
}

export default Payment