const CART_KEY = "learnix_cart";

export const getCartItems = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

export const setCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (course) => {
  const cart = getCartItems();
  const exists = cart.find((c) => c.id === course.id);
  if (!exists) {
    cart.push(course);
    setCartItems(cart);
  }
};

export const removeFromCart = (courseId) => {
  const cart = getCartItems().filter((c) => c.id !== courseId);
  setCartItems(cart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
