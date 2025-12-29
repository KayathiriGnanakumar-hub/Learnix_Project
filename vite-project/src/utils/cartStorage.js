const CART_KEY = "learnix_cart";

/* Get cart items from localStorage */
export function getCartItems() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

/* Save cart items to localStorage */
export function setCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/* Get total cart count */
export function getCartCount() {
  return getCartItems().length;
}

/* Clear cart (future use) */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
