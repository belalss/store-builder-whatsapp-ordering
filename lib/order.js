export function buildOrder({
  store,
  cart,
  customer,
  checkout,
  promo,
  totals,
  orderNote,
  lang,
  orderNumber,
}) {
  return {
    orderNumber,

    store: {
      name: store.name,
      currency: store.currency,
    },

    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    },

    checkout: {
      method: checkout.method,
      area: checkout.area,
      deliveryFee: totals.finalDeliveryFee,
    },

    items: cart.map((i) => ({
      productId: i.productId,
      name: i.productName,
      option: i.optionLabel,
      price: Number(i.price),
      qty: Number(i.quantity),
      note: i.note || "",
      lineTotal: Number(i.price) * Number(i.quantity),
    })),

    promo: promo?.ok
      ? {
          code: promo.code,
          discount: totals.promoDiscount,
        }
      : null,

    tax: totals.taxAmount
      ? {
          label: store.tax?.label,
          amount: totals.taxAmount,
        }
      : null,

    totals: {
      subtotal: totals.subtotal,
      discount: totals.promoDiscount,
      delivery: totals.finalDeliveryFee,
      tax: totals.taxAmount,
      grandTotal: totals.grandTotal,
    },

    note: orderNote || "",
    lang,
    status: "new",
    createdAt: new Date().toISOString(),

  };
}
