// lib/promo.js

const PROMO_STORAGE_KEY = "store_promo";

/**
 * Promo rules you can later move to DB.
 * Keep codes uppercase.
 */
export const PROMOS = [
  // 10% off, min subtotal 10 JD
  { code: "BASHAWATI10", type: "percent", value: 10, minSubtotal: 10,expires: "2026-12-31" },

  // -1 JD
  { code: "LESS1", type: "fixed", value: 1 },

  // free delivery (only if delivery mode)
  { code: "FREEDEL", type: "free_delivery" },

  // Example: expire date (optional)
  // { code: "RAMADAN20", type: "percent", value: 20, minSubtotal: 15, expires: "2026-04-01" },
];

export function normalizeCode(code) {
  return (code || "").trim().toUpperCase();
}

export function loadPromo() {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePromo(promoObjOrNull) {
  try {
    if (!promoObjOrNull) localStorage.removeItem(PROMO_STORAGE_KEY);
    else localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promoObjOrNull));
  } catch {}
}

export function findPromoRule(code) {
  const c = normalizeCode(code);
  if (!c) return null;
  return PROMOS.find((p) => p.code === c) || null;
}

/**
 * Compute discount based on subtotal + delivery fee + mode.
 * Returns an object you can store in state/localStorage.
 */
export function computePromo({ code, subtotal, deliveryFee, mode }) {
  const rule = findPromoRule(code);
  if (!rule) {
    return { ok: false, code: normalizeCode(code), reason: "invalid" };
  }

  if (rule.expires) {
    const now = new Date();
    const exp = new Date(rule.expires);
    if (Number.isFinite(exp.getTime()) && now > exp) {
      return { ok: false, code: rule.code, reason: "expired" };
    }
  }

  const minSubtotal = Number(rule.minSubtotal || 0);
  if (subtotal < minSubtotal) {
    return { ok: false, code: rule.code, reason: "minSubtotal", minSubtotal };
  }

  // Only allow free delivery when delivery mode
  if (rule.type === "free_delivery" && mode !== "delivery") {
    return { ok: false, code: rule.code, reason: "deliveryOnly" };
  }

  let discount = 0;
  let freeDelivery = false;

  if (rule.type === "percent") {
    discount = (subtotal * Number(rule.value || 0)) / 100;
  } else if (rule.type === "fixed") {
    discount = Number(rule.value || 0);
  } else if (rule.type === "free_delivery") {
    freeDelivery = true;
    discount = 0;
  }

  // guardrails
  discount = Math.max(0, discount);
  discount = Math.min(discount, subtotal); // never exceed subtotal

  const computedDeliveryFee = freeDelivery ? 0 : deliveryFee;
  const grandTotal = Math.max(0, subtotal - discount + computedDeliveryFee);

  return {
    ok: true,
    code: rule.code,
    type: rule.type,
    value: rule.value,
    discount,
    freeDelivery,
    minSubtotal,
    grandTotal,
  };
}
