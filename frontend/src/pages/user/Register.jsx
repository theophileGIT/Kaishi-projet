import {useState} from "react"
import {Navigate} from "react-router-dom"
import {addOneUser} from "../../api/user"

const Register = (props) => {
    
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [adress, setAddress] = useState("")
    const [zip, setZip] = useState(0)
    const [city, setCity] = useState("")
    const [phone, setPhone] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    
    const onSubmitForm = (e) => {
        e.preventDefault()
        setError(null)
        const datas = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            adress: adress,
            zip: zip,
            city: city,
            phone: phone
        }
        
        addOneUser(datas)
        .then((res)=>{
            if(res.status === 200){
                setRedirect(true)
            } else {
                setError(res.msg)
            }
        })
        .catch(err=>console.log(err))
    }
    
    if(redirect) {
        return <Navigate to="/login" />
    }
    return (
        <section id="register">
            <h2>Créer un compte</h2>
            {error !== null && <p>{error}</p>}
            <form onSubmit={onSubmitForm}>
                <input type="text"
                    placeholder="Votre prénom"
                    onChange={(e)=>{
                        setFirstName(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    placeholder="Votre nom"
                    onChange={(e)=>{
                        setLastName(e.currentTarget.value)
                    }}
                />
                <input type="email"
                    placeholder="Votre mail"
                    onChange={(e)=>{
                        setEmail(e.currentTarget.value)
                    }}
                />
                <input type="password"
                    placeholder="Votre mot de passe"
                    onChange={(e)=>{
                        setPassword(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    placeholder="Votre adresse"
                    onChange={(e)=>{
                        setAddress(e.currentTarget.value)
                    }}
                />
                <input type="number"
                    placeholder="Votre code postal"
                    onChange={(e)=>{
                        setZip(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    placeholder="Votre ville"
                    onChange={(e)=>{
                        setCity(e.currentTarget.value)
                    }}
                />
                <input type="number"
                    placeholder="Votre téléphone"
                    onChange={(e)=>{
                        setPhone(e.currentTarget.value)
                    }}
                />
                <input type="submit" name="enregister"/>
            </form>
        </section>
    )
}

export default Register