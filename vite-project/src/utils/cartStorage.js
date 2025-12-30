const CART_KEY = "learnix_cart";

export const getCartItems = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

export const setCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const removeFromCart = (id) => {
  const cart = getCartItems().filter(item => item.id !== id);
  setCartItems(cart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
