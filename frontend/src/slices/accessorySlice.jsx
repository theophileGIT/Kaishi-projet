import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [] 
};

export const accessorySlice = createSlice({
    name: "accessoire",
    initialState,
    reducers: {
        loadAccessory: (state, action) => {
            state.products = action.payload; 
        }
    }
});

export const { loadAccessory } = accessorySlice.actions;
export const selectAccessory = (state) => state.matcha; 
export default accessorySlice.reducer;
