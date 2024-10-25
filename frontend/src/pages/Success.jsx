import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { cleanBasket } from '../slices/basketSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Success = (props) => {
    const dispatch = useDispatch()
    useEffect(() => {
        window.localStorage.removeItem("kaishi-basket")
        dispatch(cleanBasket())
    }, [])

    return (
        <section id="success">
             <FontAwesomeIcon icon={faCheck} />
            <h2>L'équipe Kaishi vous remercie</h2>
            <p>Votre commande a été effectué avec succès</p>
            <p>Vous recevrez bientôt un email de confirmation avec les détails.</p>
           

            <Link to="/">Retour</Link>
        </section>
    )
}
export default Success