// lib/orderNumber.js

const KEY = "order_counter";

export function getNextOrderNumber() {
  try {
    const current = Number(localStorage.getItem(KEY) || 0);
    const next = current + 1;
    localStorage.setItem(KEY, String(next));
    return next;
  } catch {
    // fallback
    return Math.floor(Math.random() * 100000);
  }
}
