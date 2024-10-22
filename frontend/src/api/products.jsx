import axios from "axios"
import {config} from "../config"
const token = window.localStorage.getItem('kaishi-token')

//récupération de tous les produits
export function displayProducts(){
    return axios.get(`${config.api_url}/api/v1/product/all`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//récupération d'un seul produit
export function takeOneProduct(id){
    return axios.get(`${config.api_url}/api/v1/product/one/${id}`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//ajout d'un produit
export function addOneProduct(datas){
    return axios.post(`${config.api_url}/api/v1/product/save`, datas, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//modification d'un produit
export function updateOneProduct(datas, id){
    return axios.put(`${config.api_url}/api/v1/product/update/${id}`, datas, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//suppression d'un produit
export function deleteOneProduct(id){
    return axios.delete(`${config.api_url}/api/v1/product/delete/${id}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}