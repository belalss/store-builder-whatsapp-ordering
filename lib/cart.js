export function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart() {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (!isBrowser()) return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// stable key for a cart line
export function makeCartKey(productId, optionKey) {
  return `${productId}||${optionKey}`;
}

export function addItemToCart(product, option, qty = 1, note = "") {
  const cart = getCart();

  const productId = product.id ?? product.slug;      // id later, slug now
  const optionKey = option?.id ?? option?.label;     // id later, label now
  const optionLabel = option?.label ?? "";           // for UI display

  if (!productId || !optionKey) return cart;

  const cartKey = makeCartKey(productId, optionKey);
  const cleanNote = (note || "").trim();

  const idx = cart.findIndex((i) => i.cartKey === cartKey);

  if (idx >= 0) {
    cart[idx].quantity += Number(qty || 1);
    if (cleanNote) cart[idx].note = cleanNote;
  } else {
    cart.push({
      cartKey,
      productId,
      productName: product.name,
      optionKey,               // ✅ stable identifier
      optionLabel,             // ✅ display label
      price: Number(option.price || 0),
      quantity: Math.max(1, Number(qty || 1)),
      taxable: product.taxable ?? true,
      note: cleanNote,
    });
  }

  saveCart(cart);
  return cart;
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function setItemQuantity(cartKey, quantity) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.cartKey === cartKey);
  if (idx === -1) return cart;

  cart[idx].quantity = Math.max(1, Number(quantity || 1));
  saveCart(cart);
  return cart;
}

export function removeItem(cartKey) {
  const cart = getCart().filter((i) => i.cartKey !== cartKey);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}
