import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  
  isLoading: true,
 
};

export const productReducers = createReducer(initialState, (builder) => {
  builder
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload;
    })
// is these two states aredifferennt
// state.products are for stroign trhe all products and responsible for get all Shop products
    // get all products of shop
     .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
    
    })
     .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products=action.payload;
    
    })
     .addCase("getAllProductsShopFailed", (state, action) => {
      state.isLoading = false;
      state.error=action.payload;
    
    })
    //delete product of shop reducers
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteProductSuccess", (state , action) => {
      state.isLoading = false;
      state.message=action.payload;
    })
    .addCase("deleteProductFailed", (state , action) => {
      state.isLoading = false;
      state.message=action.payload;
    })
    // get all products simple with out shop
    .addCase('getAllProductsRequest', (state) => {
        state.isLoading = true;
      })
      // This replaces getAllProductsSuccess
      .addCase('getAllProductsSuccess', (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload;
      })
      // This replaces getAllProductsFailed
      .addCase('getAllProductsFailed', (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })




    .addCase("clearError", (state) => {
      state.error = null;
    });
});
