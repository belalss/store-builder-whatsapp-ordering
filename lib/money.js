export function formatCurrency(amount, currency , lang = "ar") {
  const n = Number(amount || 0);

  const locale =
    lang === "ar"
      ? currency === "EGP"
        ? "ar-EG"
        : currency === "SAR"
        ? "ar-SA"
        : "ar-JO"
      : currency === "EGP"
      ? "en-EG"
      : currency === "SAR"
      ? "en-SA"
      : "en-JO";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}
