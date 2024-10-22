import {useState, useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
//import des actions
import {selectUser, connectUser} from "../slices/userSlice"
import {selectMatcha, loadMatcha} from "../slices/matchaSlice"
import {Navigate, useParams} from "react-router-dom"
import {checkMyToken} from "../api/user"
import {displayProducts} from "../api/products"

//HOC de controle des datas et de la sécurité des routes
const RequireAuth = (props) => {
    //on récup les params de la route
    const params = useParams()
    //on récupère les states globales user et beer dans le store en mode lecture
    const user = useSelector(selectUser)
    const allMatcha = useSelector(selectMatcha)
    //on prépare la fonctionnalité pour dispatcher notre action dans le store de redux
    const dispatch = useDispatch()
    //on récupère le composant à afficher qui a été passé en tant que props
    const Child = props.child
    //gestion de la redirection
    const [redirect, setRedirect] = useState(false)
    const [redirectAdmin, setRedirectAdmin] = useState(false)
    
    //lorsque les props de notre composant sont chargés
    useEffect(()=>{
        //si les produits matcha ne sont pas chargés dans redux on les charge
        if(allMatcha.products.length === 0){
            displayProducts()
            .then((res) => {
                if(res.status === 200){
                    dispatch(loadMatcha(res.result))
                }
            })
            .catch(err=>console.log(err))
        }
        
        //on va tester si on est connecté via les infos de redux
        //si l'utilisateur n'est pas connecté
        if(user.isLogged === false){
            //on récup le token dans le storage
            const token = window.localStorage.getItem("kaishi-token")
            //si le storage répond null (pas trouve) et que la props auth est true (route protégée)
            if(token === null && props.auth){
                //accés vers la route refusée
                setRedirect(true)
            } else {
                //si le token n'est pas null
                if(token !== null){
                    //on appel notre requète ajax qui va vérifier le token dans le back
                    checkMyToken()
                    .then((res)=>{
                        //si la réponse n'est pas 200 positive
                        if(res.status !== 200){
                            //si la route est protégée
                            if(props.auth){
                                //accés vers la route refusée
                                setRedirect(true)
                            }
                        } else {
                            //on stock la réponse de la requète ajax
                            let myUser = res.user
                            //on peut rajouter le token à l'objet aussi si on veut
                            myUser.token = token
                            //appel de l'action de connexion de l'utilisateur dans le store de redux
                            dispatch(connectUser(myUser))
                            //on vérifie si jamais la route demandé est admin que son role soit admin
                            if(myUser.role !== "admin" && props.admin){
                                setRedirectAdmin(true)
                            }
                        }
                    })
                    .catch(err=>console.log(err))
                }
            }
        } else {
            //un utilisateur est connecté dans le store redux
            //si le role n'est pas admin
            if(user.infos.role !== "admin"){
                //si la props admin est true (route protégée d'admin)
                if(props.admin){
                    //on demande la redirection
                    setRedirectAdmin(true)
                }
            }
        }
    }, [props])
    
    if(redirect){
        return <Navigate to="/login" />
    }
    if(redirectAdmin){
        return <Navigate to="/" />
    }
    return (<Child {...props} params={params} />)
}

export default RequireAuth