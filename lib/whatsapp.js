// lib/whatsapp.js
import { formatCurrency } from "@/lib/money";

/**
 * Builds a WhatsApp URL (wa.me) with an order message.
 * Expects standardized `order` from buildOrder().
 */
export function buildWhatsAppUrl({ phone, order }) {
  const items = order?.items || [];
  if (items.length === 0) return null;

  const lang = order?.lang || "ar";
  const isAr = lang === "ar";

  const storeName = order?.store?.name || "";
  const currency = order?.store?.currency; // required for formatCurrency
  const customer = order?.customer || {};
  const checkout = order?.checkout || {};
  const orderNote = order?.note || "";
  const orderNumber = order?.orderNumber;

  const promoCode = order?.promo?.code || "";
  const discount = Number(order?.totals?.discount || 0);
  const deliveryFee = Number(order?.totals?.delivery || 0);
  const grandTotal = Number(order?.totals?.grandTotal);

  const taxAmount = Number(order?.tax?.amount || 0);
  const taxLabel = order?.tax?.label; // { ar, en } optional

  const safe = (v) => (v == null ? "" : String(v));
  const money = (n) => formatCurrency(Number(n || 0), currency, lang);

  const methodLabel =
    checkout?.method === "delivery"
      ? isAr
        ? "توصيل"
        : "Delivery"
      : isAr
      ? "استلام"
      : "Pickup";

  let message = "";

  // Header
  if (isAr) {
    message += `مرحباً، أود الطلب من ${storeName}\n`;
    if (orderNumber) message += `رقم الطلب: ${orderNumber}\n`;
    message += `\n`;
  } else {
    message += `Hello, I would like to order from ${storeName}:\n`;
    if (orderNumber) message += `Order ID: ${orderNumber}\n`;
    message += `\n`;
  }

  // Items
  message += isAr ? "🧁 المنتجات:\n" : "🧁 Items:\n";

  items.forEach((item, i) => {
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    const lineTotal = price * qty;

    const name = safe(item.name);
    const opt = safe(item.option);

    if (isAr) {
      message += `${i + 1}) ${name} - ${opt} ×${qty} = ${money(lineTotal)}\n`;
      if (item.note) message += `   ملاحظة الصنف: ${safe(item.note)}\n`;
    } else {
      message += `${i + 1}) ${name} - ${opt} x${qty} = ${money(lineTotal)}\n`;
      if (item.note) message += `   Item note: ${safe(item.note)}\n`;
    }
  });

  // Order type
  message += `\n${isAr ? "نوع الطلب" : "Order type"}: ${methodLabel}\n`;

  // Delivery details
  if (checkout?.method === "delivery") {
    if (isAr) {
      message += `المنطقة: ${safe(checkout?.area)}\n`;
      message += `رسوم التوصيل: ${money(deliveryFee)}\n`;
    } else {
      message += `Area: ${safe(checkout?.area)}\n`;
      message += `Delivery fee: ${money(deliveryFee)}\n`;
    }
  }

  // Promo / Discount
  const cleanCode = safe(promoCode).trim();
  if (cleanCode) {
    message += `\n${isAr ? "كود الخصم" : "Promo code"}: ${cleanCode}\n`;
  }
  if (discount > 0) {
    message += `${isAr ? "الخصم" : "Discount"}: -${money(discount)}\n`;
  }

  // Tax
  if (taxAmount > 0) {
    const label = isAr ? taxLabel?.ar || "ضريبة" : taxLabel?.en || "Tax";
    message += `${label}: ${money(taxAmount)}\n`;
  }

  // Order note
  if (safe(orderNote).trim()) {
    message += `\n${isAr ? "ملاحظة الطلب" : "Order note"}:\n${safe(orderNote).trim()}\n`;
  }

  // Customer info
  message += `\n${isAr ? "بيانات العميل" : "Customer Info"}:\n`;
  message += `${isAr ? "الاسم" : "Name"}: ${safe(customer?.name)}\n`;
  message += `${isAr ? "الهاتف" : "Phone"}: ${safe(customer?.phone)}\n`;
  message += `${isAr ? "العنوان" : "Address"}: ${safe(customer?.address)}\n`;

  // Grand total
  if (!Number.isNaN(grandTotal)) {
    message += `\n${isAr ? "الإجمالي" : "Grand total"}: ${money(grandTotal)}\n`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
