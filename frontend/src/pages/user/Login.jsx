import { useState } from "react"
import { Navigate } from "react-router-dom"
import { loginUser } from "../../api/user"
import { connectUser } from "../../slices/userSlice"
import { useDispatch } from "react-redux"
const Login = (props) => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)

    const onSubmitForm = (e) => {
        e.preventDefault()
        setError(null)

        const datas = {
            email: email,
            password: password
        }
        loginUser(datas)
            .then((res) => {
                if (res.status === 200) {
                    window.localStorage.setItem('kaishi-token', res.token)
                    let newUser = res.user
                    newUser.token = res.token
                    dispatch(connectUser(newUser))
                    setRedirect(true)
                } else {
                    setError(res.msg)
                }
            })
            .catch(err => console.log(err))
    }
    if (redirect) {
        return <Navigate to="/" />
    }
    return (
        <div>
            <section id="connexion">
                <h2>Se connecter</h2>
                {error !== null && <p>{error}</p>}
                <form onSubmit={onSubmitForm} >
                    <input type="email"
                        placeholder="Votre mail"
                        onChange={(e) => {
                            setEmail(e.currentTarget.value)
                        }}
                    />
                    <input type="password"
                        placeholder="Votre mot de passe"
                        onChange={(e) => {
                            setPassword(e.currentTarget.value)
                        }}
                    />
                    <input type="submit" name="Enregistrer" />
                </form>
            </section>
        </div>)
}
export default Login