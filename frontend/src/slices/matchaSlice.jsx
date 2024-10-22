import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [] 
};

export const matchaSlice = createSlice({
    name: "matcha",
    initialState,
    reducers: {
        loadMatcha: (state, action) => {
            state.products = action.payload; 
        }
    }
});

export const { loadMatcha } = matchaSlice.actions;
export const selectMatcha = (state) => state.matcha; 
export default matchaSlice.reducer;
