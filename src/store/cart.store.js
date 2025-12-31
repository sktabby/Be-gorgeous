const KEY = "begorgeous_cart_v1";

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items || []));
}

export function addToCart(item) {
  const cart = getCart();

  // ✅ make sure required fields exist
  const normalized = {
    id: item.id,
    name: item.name ?? item.title ?? "Item",
    price: Number(item.price ?? item.mrp ?? 0),
    img: item.img ?? item.img1 ?? item.image ?? "",
    qty: 1,
  };

  const idx = cart.findIndex((x) => x.id === normalized.id);

  if (idx >= 0) cart[idx].qty = (Number(cart[idx].qty) || 1) + 1;
  else cart.push(normalized);

  setCart(cart);
  return cart;
}

export function updateQty(id, qty) {
  const q = Number(qty);

  const cart = getCart()
    .map((x) => (x.id === id ? { ...x, qty: q } : x))
    .filter((x) => Number(x.qty) > 0);

  setCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(KEY);
}

export function removeFromCart(id) {
  const cart = getCart().filter((x) => x.id !== id);
  setCart(cart);
  return cart;
}
