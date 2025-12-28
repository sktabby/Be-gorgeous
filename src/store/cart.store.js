const KEY = "begorgeous_cart_v1";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.id === item.id);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ ...item, qty: 1 });
  setCart(cart);
  return cart;
}

export function updateQty(id, qty) {
  const cart = getCart().map((x) => (x.id === id ? { ...x, qty } : x));
  setCart(cart.filter((x) => x.qty > 0));
  return getCart();
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
