import axios from "axios"
import { config } from "../config"
const token = window.localStorage.getItem('kaishi-token')

export function addOneContact(datas) {
    return axios.post(`${config.api_url}/api/v1/contact`, datas, { headers: { "x-access-token": token } })
        .then((res) => {
            console.log("Réponse de l'API :", res.data);
            return res.data;
        })
        .catch((err) => {
            console.error("Erreur lors de l'envoi :", err); 
            return err;
        })
}