import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import matchaReducer from "./matchaSlice"
import basketReducer from "./basketSlice"



const store = configureStore({
    reducer: {
        user: userReducer,
        matcha: matchaReducer,
        basket: basketReducer,

    }
})

export default store