export const STORE = {
  name: "البشاواتي",
  phone: "0799304026",
  whatsapp: "962799304026",
  currency: "JOD", // change to SAR / EGP later
  hours: "Daily 9:00 – 22:00",

  tax: {
    enabled: true,
    type: "percent",   // "percent" | "fixed"
    value: 16,         // 16% VAT (or fixed amount if type=fixed)
    label: { ar: "ضريبة", en: "Tax" },
  },

  deliveryAreas: [
    { label: "Amman - Abdoun", fee: 2.0 },
    { label: "Amman - Sweifieh", fee: 2.0 },
    { label: "Amman - Khalda", fee: 2.5 },
    { label: "Amman - Tabarbour", fee: 2.5 },
  ],
};
