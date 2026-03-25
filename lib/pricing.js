// lib/pricing.js

/**
 * Computes full order totals in one place.
 * - cart lines can include: price, quantity, taxable (boolean)
 * - storeTax: { enabled, type:"percent"|"fixed", value }
 * - promo: result from computePromo (or null)
 */
export function computeTotals({
  cart = [],
  checkout = { method: "pickup", deliveryFee: 0 },
  promo = null,
  storeTax = { enabled: false },
}) {
  // ---------- Subtotal ----------
  const subtotal = cart.reduce((sum, item) => {
    const line = Number(item.price || 0) * Number(item.quantity || 0);
    return sum + line;
  }, 0);

  // ---------- Delivery ----------
  const baseDeliveryFee =
    checkout?.method === "delivery" ? Number(checkout?.deliveryFee || 0) : 0;

  // ---------- Promo ----------
  const promoDiscount = promo?.ok ? Number(promo.discount || 0) : 0;
  const promoFreeDelivery = promo?.ok ? !!promo.freeDelivery : false;

  const finalDeliveryFee =
    checkout?.method === "delivery" ? (promoFreeDelivery ? 0 : baseDeliveryFee) : 0;

  // ---------- Taxable Subtotal ----------
  const taxableSubtotal = cart.reduce((sum, item) => {
    const isTaxable = item.taxable ?? true; // default true
    if (!isTaxable) return sum;
    const line = Number(item.price || 0) * Number(item.quantity || 0);
    return sum + line;
  }, 0);

  // ---------- Tax ----------
  let taxAmount = 0;
  if (storeTax?.enabled) {
    const val = Number(storeTax.value || 0);

    if (storeTax.type === "percent") {
      taxAmount = taxableSubtotal * (val / 100);
    } else if (storeTax.type === "fixed") {
      taxAmount = val;
    }
  }

  // ---------- Grand Total ----------
  const grandTotal = Math.max(0, subtotal - promoDiscount + finalDeliveryFee + taxAmount);

  return {
    subtotal,
    taxableSubtotal,

    baseDeliveryFee,
    finalDeliveryFee,

    promoDiscount,
    promoFreeDelivery,

    taxAmount,

    grandTotal,
  };
}