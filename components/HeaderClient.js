"use client";

import React from "react";
import { formatCurrency } from "@/lib/money";
import { useRouter } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { STORE } from "@/lib/store";
import { computeTotals } from "@/lib/pricing";
import { buildOrder } from "@/lib/order";
import { saveLastOrder } from "@/lib/orders";


import {
  getCart,
  getCartCount,
  setItemQuantity,
  removeItem,
  clearCart,
} from "@/lib/cart";

import { computePromo, loadPromo, savePromo } from "@/lib/promo";

import LangToggle from "@/components/LangToggle";
import HtmlLangSync from "@/components/HtmlLangSync";
import { getInitialLang, setLang as saveLang } from "@/lib/i18n";
import { getNextOrderNumber } from "@/lib/orderNumber";
import { calcTax } from "@/lib/tax";

/*const STORE = {
  name: "البشاواتي",
  whatsapp: "962799304026",
  currency: "JOD", // change to SAR / EGP later
};*/


const CUSTOMER_KEY = "customer";
const ORDER_NOTE_KEY = "orderNote";
const CHECKOUT_KEY = "checkout";

/*const DELIVERY_AREAS = [
  { label: "Amman - Abdoun", fee: 2.0 },
  { label: "Amman - Sweifieh", fee: 2.0 },
  { label: "Amman - Khalda", fee: 2.5 },
  { label: "Amman - Tabarbour", fee: 2.5 },
];*/


function loadCheckout() {
  try {
    return JSON.parse(
      localStorage.getItem(CHECKOUT_KEY) ||
      '{"method":"pickup","area":"","deliveryFee":0}'
    );
  } catch {
    return { method: "pickup", area: "", deliveryFee: 0 };
  }
}

function saveCheckout(v) {
  try {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(v));
  } catch { }
}

function loadCustomer() {
  try {
    return JSON.parse(
      localStorage.getItem(CUSTOMER_KEY) || '{"name":"","phone":"","address":""}'
    );
  } catch {
    return { name: "", phone: "", address: "" };
  }
}

function saveCustomer(c) {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
  } catch { }
}

function loadOrderNote() {
  try {
    return localStorage.getItem(ORDER_NOTE_KEY) || "";
  } catch {
    return "";
  }
}

function saveOrderNote(v) {
  try {
    localStorage.setItem(ORDER_NOTE_KEY, v || "");
  } catch { }
}

function promoReasonToArabic(res) {
  if (!res) return "تعذر تطبيق كود الخصم";
  if (res.reason === "invalid") return "كود الخصم غير صحيح";
  if (res.reason === "expired") return "كود الخصم منتهي";
  if (res.reason === "minSubtotal")
    return `الحد الأدنى للطلب ${formatCurrency(res.minSubtotal, STORE.currency, "ar")}`;
  if (res.reason === "deliveryOnly") return "هذا الكود للتوصيل فقط";
  return "تعذر تطبيق كود الخصم";
}

export default function HeaderClient() {
  // ✅ Language hooks MUST be at top of component
  const [lang, setLangState] = React.useState("ar");
  const router = useRouter();
  // UI state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const [customer, setCustomer] = React.useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orderNote, setOrderNote] = React.useState("");

  const [checkout, setCheckout] = React.useState({
    method: "pickup",
    area: "",
    deliveryFee: 0,
  });

  // ✅ Promo state
  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState(null);
  const [promoError, setPromoError] = React.useState("");

  const recalc = React.useCallback(() => {
    const c = getCart();
    setCart(c);
    setTotal(c.reduce((sum, item) => sum + item.price * item.quantity, 0));
    setCartCount(getCartCount());
  }, []);

  // ✅ Load once: cart + customer + checkout + note + promo + lang
  React.useEffect(() => {
    recalc();

    setCustomer(loadCustomer());
    setCheckout(loadCheckout());
    setOrderNote(loadOrderNote());

    const savedPromo = loadPromo();
    if (savedPromo?.code) {
      setPromoInput(savedPromo.code);
      setPromo({ code: savedPromo.code }); // will be computed by effect below
    }

    setLangState(getInitialLang());
  }, [recalc]);

  function changeLang(next) {
    setLangState(next);
    saveLang(next);
    window.dispatchEvent(new Event("langChanged"));
  }


  // ✅ Save customer / note / checkout
  React.useEffect(() => {
    saveCustomer(customer);
  }, [customer]);

  React.useEffect(() => {
    saveOrderNote(orderNote);
  }, [orderNote]);

  React.useEffect(() => {
    saveCheckout(checkout);
  }, [checkout]);

  // ✅ Refresh cart on focus
  React.useEffect(() => {
    const onFocus = () => recalc();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [recalc]);

  // ✅ Refresh cart on cartUpdated event
  React.useEffect(() => {
    const handler = () => recalc();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, [recalc]);

  // cart actions
  const incItem = (cartKey) => {
    const item = getCart().find((i) => i.cartKey === cartKey);
    if (!item) return;
    setItemQuantity(cartKey, item.quantity + 1);
    recalc();
  };

  const decItem = (cartKey) => {
    const item = getCart().find((i) => i.cartKey === cartKey);
    if (!item) return;
    setItemQuantity(cartKey, item.quantity - 1);
    recalc();
  };

  const removeCartItem = (cartKey) => {
    removeItem(cartKey);
    recalc();
  };

  // -------------------------
  // ✅ Promo computation
  // -------------------------
  const rowsubtotal = total;
  const baseDeliveryFee =
    checkout.method === "delivery" ? Number(checkout.deliveryFee || 0) : 0;

  React.useEffect(() => {
    if (!promo?.code) return;

    const res = computePromo({
      code: promo.code,
      subtotal,
      deliveryFee: baseDeliveryFee,
      mode: checkout.method,
    });

    if (res.ok) {
      setPromo(res);
      savePromo({ code: res.code });
      setPromoError("");
    } else {
      setPromo(null);
      savePromo(null);
      setPromoError(promoReasonToArabic(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsubtotal, baseDeliveryFee, checkout.method]);

  function applyPromo() {
    const res = computePromo({
      code: promoInput,
      subtotal: rowsubtotal,
      deliveryFee: baseDeliveryFee,
      mode: checkout.method,
    });

    if (res.ok) {
      setPromo(res);
      savePromo({ code: res.code });
      setPromoError("");
    } else {
      setPromo(null);
      savePromo(null);
      setPromoError(promoReasonToArabic(res));
    }
  };

  function clearPromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError("");
    savePromo(null);
  };

  /*const promoDiscount = promo?.ok ? Number(promo.discount || 0) : 0;
   const promoFreeDelivery = promo?.ok ? !!promo.freeDelivery : false;
 
   const finalDeliveryFee =
     checkout.method === "delivery"
       ? promoFreeDelivery
         ? 0
         : baseDeliveryFee
       : 0;
 const { taxAmount } = calcTax({ cart, tax: STORE.tax });
   const grandTotal = Math.max(
   0,
   subtotal - promoDiscount + finalDeliveryFee + taxAmount
 )*/;
  const totals = computeTotals({
    cart,
    checkout,
    promo,
    storeTax: STORE.tax,
  });

  const {
    subtotal,
    finalDeliveryFee,
    promoDiscount,
    taxAmount,
    grandTotal,
  } = totals;

  // -------------------------
  // ✅ WhatsApp send
  // -------------------------
  const sendToWhatsApp = async () => {
    const c = getCart();
    const orderNumber = getNextOrderNumber();

    const order = buildOrder({
      store: STORE,
      cart: c,
      customer,
      checkout,
      promo,
      totals,
      orderNote,
      lang,
      orderNumber,
    });
    // ✅ save locally
    saveLastOrder(order);
    // optional
    console.log("ORDER:", order);

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const url = buildWhatsAppUrl({
      phone: STORE.whatsapp,
      order,
    });

    if (!url) {
      alert("Cart is empty");
      return;
    }

    window.open(url, "_blank");

    // clear cart only (keep customer)
    clearCart();
    recalc();
    setDrawerOpen(false);

    setOrderNote("");
    saveOrderNote("");
  };


  return (
    <>
      {/* Sync html lang/dir */}
      <HtmlLangSync lang={lang} />

      {/* Toggle + Cart button */}
      <LangToggle lang={lang} onChange={changeLang} />

      <button className="btn" onClick={() => setDrawerOpen(true)}>
        🛒 {cartCount}
      </button>

      <CartDrawer
        lang={lang}
        currency={STORE.currency}   // ✅ add
        taxAmount={taxAmount}
        taxLabel={STORE.tax?.label}
        //taxEnabled={STORE.tax?.enabled}
        taxEnabled={!!STORE.tax?.enabled}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        total={subtotal}
        onSend={sendToWhatsApp}
        onInc={incItem}
        onDec={decItem}
        onRemove={removeCartItem}
        customer={customer}
        onCustomerChange={setCustomer}
        orderNote={orderNote}
        onOrderNoteChange={setOrderNote}
        checkout={checkout}
        onCheckoutChange={setCheckout}
        deliveryAreas={STORE.deliveryAreas}
        promoInput={promoInput}
        onPromoInput={setPromoInput}
        onApplyPromo={applyPromo}
        onClearPromo={clearPromo}
        promo={promo}
        promoError={promoError}
        discount={promoDiscount}
        finalDeliveryFee={finalDeliveryFee}
        grandTotal={grandTotal}
      />
    </>
  );
}
