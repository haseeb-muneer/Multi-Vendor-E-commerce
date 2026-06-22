import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
};

export const userReducers = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
// update user information
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // update address info
    // Request/Pending
    .addCase("updateUserAddressRequest", (state) => {
      state.addressloading = true;
    })
    
    // Success/Fulfilled
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    
    // Failed/Rejected
    .addCase("updateUserAddressFailed", (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })
   
      // delete user address
      .addCase("deleteUserAddressRequest", (state) => {
        state.addressloading = true;
      })
      .addCase("deleteUserAddressSuccess", (state, action) => {
        state.addressloading = false;
        state.successMessage = action.payload.successMessage;
        state.user = action.payload.user;
      })
      .addCase("deleteUserAddressFailed", (state, action) => {
        state.addressloading = false;
        state.error = action.payload;
      })

    .addCase("clearError", (state) => {
      state.error = null;
    });
});
