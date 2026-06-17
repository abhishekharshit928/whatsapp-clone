import { createSlice } from "@reduxjs/toolkit";

const selectedMessageSlice = createSlice({
  name: "selectedMessage",
  initialState: {
    selected: []
  },
  reducers: {
   setSelectedMessage: (state, action) => {
      state.selected.push(action.payload);
    },

    removeSelectedMessage: (state, action) => {
      state.selected = state.selected.filter(
        msg => msg._id !== action.payload
      );
    },

    removeAllSelectedMessage: (state) => {
      state.selected = [];
    }
  }
});

export const {setSelectedMessage,removeSelectedMessage,removeAllSelectedMessage} = selectedMessageSlice.actions;
export default selectedMessageSlice.reducer;