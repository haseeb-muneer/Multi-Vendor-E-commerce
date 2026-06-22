import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducers = createReducer(initialState, (builder) => {
  builder
    // Add to Wishlist
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);

      if (isItemExist) {
        // If it exists, update the item at its current index
        const index = state.wishlist.findIndex((i) => i._id === isItemExist._id);
        state.wishlist[index] = item;
      } else {
        // If it's new, just push it into the array
        state.wishlist.push(item);
      }
    })

    // Remove from Wishlist
    .addCase("removeFromWishlist", (state, action) => {
      // Filter out the item by its ID
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
    });
});