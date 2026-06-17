import { createSlice } from "@reduxjs/toolkit";
const uiSlice = createSlice({
name: "ui",
initialState:{
    openSearch: false
},
reducers:{
    openSearchScreen:(state)=>{
        state.openSearch = true
    },
    closeSerachScreen:(state)=>{
       state.openSearch = false
    }
},
})
export const {openSearchScreen, closeSerachScreen} = uiSlice.actions
export default uiSlice.reducer