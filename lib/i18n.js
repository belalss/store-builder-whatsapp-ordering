// lib/i18n.js

export const LANG_KEY = "store_lang";

export const LANGS = {
  ar: { code: "ar", label: "عربي", dir: "rtl" },
  en: { code: "en", label: "EN", dir: "ltr" },
};

// Client-only (recommended for your use-case)
export function getInitialLang() {
  if (typeof window === "undefined") return "ar";

  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch {}

  return "ar";
}

export function setLang(lang) {
  if (typeof window === "undefined") return;

  const safe = lang === "ar" || lang === "en" ? lang : "ar";

  try {
    localStorage.setItem(LANG_KEY, safe);
  } catch {}

  // optional: cookie (only needed if you later want server pages to read lang)
  document.cookie = `lang=${safe}; path=/; max-age=31536000; samesite=lax`;
}

export function t(lang, key) {
  const dict = translations[lang] || translations.ar;
  return dict[key] || key;
}

const translations = {
  ar: {
    cart: "السلة",
    close: "إغلاق",
    send_whatsapp: "إرسال عبر واتساب",
    customer_info: "بيانات العميل",
    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    order_note: "ملاحظة الطلب",
    delivery: "توصيل",
    pickup: "استلام",
    select_area: "اختر المنطقة",
    promo_code: "كود الخصم",
    apply: "تطبيق",
    remove: "إزالة",
    total: "الإجمالي",
    discount: "الخصم",
    delivery_fee: "رسوم التوصيل",
    cart_empty: "السلة فارغة.",
    item_note: "ملاحظة الصنف",
  },
  en: {
    cart: "Cart",
    close: "Close",
    send_whatsapp: "Send via WhatsApp",
    customer_info: "Customer Info",
    name: "Name",
    phone: "Phone",
    address: "Address",
    order_note: "Order Note",
    delivery: "Delivery",
    pickup: "Pickup",
    select_area: "Select area",
    promo_code: "Promo code",
    apply: "Apply",
    remove: "Remove",
    total: "Total",
    discount: "Discount",
    delivery_fee: "Delivery fee",
    cart_empty: "Cart is empty.",
    item_note: "Item note",
  },
};
