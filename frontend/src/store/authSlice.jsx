import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",


  initialState: {
    user: null,
    isAuthenticated: false,
    storeLoading: true,
  },

  reducers: {

    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.storeLoading= false;
    },
    

    onlogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.storeLoading = false;
    }

  }
});

export const { setUser, onlogout } = authSlice.actions;

export default authSlice.reducer;