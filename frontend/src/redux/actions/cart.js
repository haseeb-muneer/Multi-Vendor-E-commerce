

// Add to cart
export const addToCartItem = (data) => (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: data,
  });

  // Sync to local storage
  const updatedCart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  return data;
};

// Remove from cart
export const removeFromCartItem = (data) => (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });

  // Sync to local storage
  const updatedCart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
};