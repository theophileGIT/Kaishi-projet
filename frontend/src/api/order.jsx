import axios from 'axios'
import {config} from '../config'
const token = window.localStorage.getItem('kaishi-token')

//sauvegarde d'une commande
export function saveOneOrder(datas){
    return axios.post(`${config.api_url}/api/v1/order/save`, datas, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//vérification de paiement
export function checkPayment(datas){
    return axios.post(`${config.api_url}/api/v1/order/payment`, datas, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//validation du paiement
export function updateOrder(datas){
    return axios.put(`${config.api_url}/api/v1/order/validate`, datas, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//récupération de toutes les commandes
export function getAllOrders(){
    return axios.get(`${config.api_url}/api/v1/order/all`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//détail d'une commande
export function getOneOrder(id){
    return axios.get(`${config.api_url}/api/v1/order/getOneOrder/${id}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}