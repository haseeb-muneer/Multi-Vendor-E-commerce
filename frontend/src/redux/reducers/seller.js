import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  
  isLoading: true,
 
};

export const sellerReducers = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.seller = action.payload;
      state.isSeller = true;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.isSeller = false;
      state.error = action.payload;
    })
    .addCase("clearError", (state) => {
      state.error = null;
    });
});
