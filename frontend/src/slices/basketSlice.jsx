import {createSlice} from "@reduxjs/toolkit"

//récupération du panier présent dans le localStorage
let lsBasket = JSON.parse(window.localStorage.getItem("kaishi-basket"))
//soit il retourne un tableau d'objet (panier présent) sinon null (pas trouvé de panier)

//si jamais on a pas de panier dans le storage 
if(lsBasket === null){
    //on initialise un panier vide
    lsBasket = []
}
//fonction qui va calculer le prix total du panier venant du storage (boucle à l'intérieur on additionne les prix de chaque ligne)
const calculateTotalAmount = (basket) => {
    let price = 0
    basket.forEach((b) => {
        price += parseInt(b.quantityInCart) * parseFloat(b.price)
    })
    return price
}


//on appel la fonction pour initialiser un prix par défaut lors du chargement du panier dans le store de redux
let myPrice = calculateTotalAmount(lsBasket)


/*on initialise une state: 
    soit on aura basket avec un tableau d'objet et totalPrice avec la somme totale
    soit on aura basket avec un tableau vide et totalPrice à zero
*/
const initialState = {
    basket: lsBasket,
    totalPrice: myPrice
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        modifyBasket: (state, action) => {
            let total = calculateTotalAmount(action.payload)
            state.basket = action.payload
            state.totalPrice = total
        },
        cleanBasket: (state) => {
            state.basket = []
            state.totalPrice = 0
        }
    }
})

export const {modifyBasket, cleanBasket} = basketSlice.actions
export const selectBasket = (state) => state.basket
export default basketSlice.reducer

