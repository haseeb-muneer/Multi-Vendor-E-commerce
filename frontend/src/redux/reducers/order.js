import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  
  isLoading: true,
 
};

export const orderReducers = createReducer(initialState, (builder) => {
  builder


     .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    
    })
     .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders=action.payload;
    
    })
     .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error=action.payload;
    
    })
// get all ordres of shop
    .addCase("getAllOrdersShopRequest", (state) => {
  state.isLoading = true;
})
.addCase("getAllOrdersShopSuccess", (state, action) => {
  state.isLoading = false;
  state.orders = action.payload;
})
.addCase("getAllOrdersShopFailure", (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
})
   
    .addCase("clearError", (state) => {
      state.error = null;
    });
});
