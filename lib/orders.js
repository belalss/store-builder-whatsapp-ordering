const LAST_ORDER_KEY = "last_order";

export function saveLastOrder(order) {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {}
}

export function loadLastOrder() {
  try {
    return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  try {
    localStorage.removeItem(LAST_ORDER_KEY);
  } catch {}
}
