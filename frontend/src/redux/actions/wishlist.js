// add to wishlist
export const addToWishlistItem = (data) => async (dispatch, getState) => {
    dispatch({
      type: "addToWishlist",
      payload: data,
    });
  
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
    return data;
  };
  
  // remove from wishlist
  export const removeFromWishlistItem = (data) => async (dispatch, getState) => {
    dispatch({
      type: "removeFromWishlist",
      payload: data._id,
    });
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
    return data;
  };