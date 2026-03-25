"use client";

import React from "react";
import { formatCurrency } from "@/lib/money";
import { t } from "@/lib/i18n";

export default function CartDrawer({
  lang,
  currency,

  open,
  onClose,
  cart,

  discount = 0,
  finalDeliveryFee = 0,
  grandTotal,

  taxAmount = 0,
  taxEnabled = false,
  taxLabel,

  checkout,
  onCheckoutChange,
  deliveryAreas,

  onSend,
  onInc,
  onDec,
  onRemove,

  customer,
  onCustomerChange,
  orderNote,
  onOrderNoteChange,

  promoInput,
  onPromoInput,
  onApplyPromo,
  onClearPromo,
  promo,
  promoError,
}) {
  if (!open) return null;

  const isDelivery = checkout?.method === "delivery";

  const canSend =
    cart.length > 0 &&
    !!customer?.name?.trim() &&
    !!customer?.phone?.trim() &&
    (!isDelivery || (!!customer?.address?.trim() && !!checkout?.area));

  const hasDiscount = Number(discount || 0) > 0;
  const hasPromo = !!promo?.ok;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 300,
        overflow: "hidden",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "min(420px, 92vw)",
          background: "white",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flex: "0 0 auto",
          }}
        >
          <h2 style={{ margin: 0 }}>{t(lang, "cart")}</h2>
          <button className="btn" onClick={onClose} type="button">
            {t(lang, "close")}
          </button>
        </div>

        {/* ITEMS */}
        <div
          style={{
            maxHeight: "40vh",
            overflowY: "auto",
            padding: 16,
            borderBottom: "1px solid #eee",
          }}
        >
          {cart.length === 0 ? (
            <p style={{ marginTop: 0 }}>{t(lang, "cart_empty")}</p>
          ) : (
            cart.map((item) => {
              const lineTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={item.cartKey || `${item.productId}-${item.optionLabel}`}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #f2f2f2",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item.productName}</div>

                  <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                    {item.optionLabel}
                  </div>

                  {item.note ? (
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                      {t(lang, "item_note")}: {item.note}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <button
                      className="btn"
                      onClick={() => onDec(item.cartKey)}
                      type="button"
                    >
                      -
                    </button>

                    <div style={{ minWidth: 24, textAlign: "center" }}>
                      {item.quantity}
                    </div>

                    <button
                      className="btn"
                      onClick={() => onInc(item.cartKey)}
                      type="button"
                    >
                      +
                    </button>

                    <div style={{ flex: 1 }} />

                    <button
                      className="btn"
                      onClick={() => onRemove(item.cartKey)}
                      type="button"
                    >
                      {t(lang, "remove")}
                    </button>
                  </div>

                  <div style={{ fontSize: 14, marginTop: 8 }}>
                    {formatCurrency(lineTotal, currency, lang)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* DETAILS */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {/* Customer Info */}
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: 12 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{t(lang, "customer_info")}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={customer?.name || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, name: e.target.value })
                }
                placeholder={t(lang, "name")}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <input
                value={customer?.phone || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, phone: e.target.value })
                }
                placeholder={t(lang, "phone")}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <input
                value={customer?.address || ""}
                onChange={(e) =>
                  onCustomerChange({ ...customer, address: e.target.value })
                }
                placeholder={t(lang, "address")}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          {/* Order Note */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{t(lang, "order_note")}</h3>
            <textarea
              value={orderNote || ""}
              onChange={(e) => onOrderNoteChange(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "مثال: اتصل قبل الوصول / التوصيل بعد الساعة 6..."
                  : "Example: call before arriving / deliver after 6pm..."
              }
              style={{
                width: "100%",
                height: 52,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
                resize: "none",
              }}
            />
          </div>

          {/* Delivery */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{t(lang, "delivery")}</h3>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  onCheckoutChange({
                    method: "pickup",
                    area: "",
                    deliveryFee: 0,
                  })
                }
                style={{ fontWeight: checkout?.method === "pickup" ? 700 : 400 }}
              >
                {t(lang, "pickup")}
              </button>

              <button
                type="button"
                className="btn"
                onClick={() =>
                  onCheckoutChange({ ...checkout, method: "delivery" })
                }
                style={{
                  fontWeight: checkout?.method === "delivery" ? 700 : 400,
                }}
              >
                {t(lang, "delivery")}
              </button>
            </div>

            {isDelivery && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <select
                  value={checkout?.area || ""}
                  onChange={(e) => {
                    const area = e.target.value;
                    const found = deliveryAreas.find((a) => a.label === area);

                    onCheckoutChange({
                      ...checkout,
                      area,
                      deliveryFee: found ? found.fee : 0,
                    });
                  }}
                  style={{
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                  }}
                >
                  <option value="">{t(lang, "select_area")}</option>
                  {deliveryAreas.map((a) => (
                    <option key={a.label} value={a.label}>
                      {a.label} (+{formatCurrency(a.fee, currency, lang)})
                    </option>
                  ))}
                </select>

                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {t(lang, "delivery_fee")}:{" "}
                  {formatCurrency(finalDeliveryFee, currency, lang)}
                  {hasPromo && promo?.freeDelivery
                    ? lang === "ar"
                      ? " (توصيل مجاني)"
                      : " (Free delivery)"
                    : ""}
                </div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {lang === "ar"
                    ? "* العنوان مطلوب للتوصيل"
                    : "* Address is required for delivery"}
                </div>
              </div>
            )}
          </div>

          {/* Promo */}
          <div
            style={{
              paddingTop: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{t(lang, "promo_code")}</h3>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={promoInput || ""}
                onChange={(e) => onPromoInput?.(e.target.value)}
                placeholder={t(lang, "promo_code")}
                style={{
                  flex: 1,
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              />

              <button type="button" className="btn" onClick={onApplyPromo}>
                {t(lang, "apply")}
              </button>

              {hasPromo && (
                <button type="button" className="btn" onClick={onClearPromo}>
                  {t(lang, "remove")}
                </button>
              )}
            </div>

            {promoError ? (
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                {promoError}
              </div>
            ) : null}

            {hasPromo ? (
              <div style={{ marginTop: 8, fontSize: 13 }}>
                ✅ {lang === "ar" ? "تم تطبيق" : "Applied"}: <b>{promo.code}</b>
                {promo.type === "free_delivery" ? (
                  <div>{lang === "ar" ? "🚚 توصيل مجاني" : "🚚 Free delivery"}</div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Total + Send */}
          <div style={{ paddingTop: 12, paddingBottom: 18 }}>
            {hasDiscount ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                <div>{t(lang, "discount")}</div>
                <div>-{formatCurrency(discount, currency, lang)}</div>
              </div>
            ) : null}

            {isDelivery ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                <div>{t(lang, "delivery_fee")}</div>
                <div>{formatCurrency(finalDeliveryFee, currency, lang)}</div>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              {taxEnabled && Number(taxAmount) > 0 ? (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <div>{lang === "ar" ? (taxLabel?.ar || "ضريبة") : (taxLabel?.en || "Tax")}</div>
                  <div>{formatCurrency(taxAmount, currency, lang)}</div>
                </div>
              ) : null}

              <strong>{t(lang, "total")}</strong>
              <strong>{formatCurrency(grandTotal, currency, lang)}</strong>
            </div>

            <button
              className="btn"
              style={{ width: "100%", opacity: canSend ? 1 : 0.5 }}
              onClick={onSend}
              disabled={!canSend}
              type="button"
            >
              {t(lang, "send_whatsapp")}
            </button>

            {!canSend && (
              <p style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
                {lang === "ar"
                  ? "يرجى إدخال الاسم والهاتف (والعنوان + المنطقة للتوصيل)."
                  : "Please enter your name and phone (and address + area for delivery)."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
