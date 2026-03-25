"use client";

import React from "react";
import { formatCurrency } from "@/lib/money";
import { getInitialLang } from "@/lib/i18n";

export default function PriceRangeClient({ options = [], currency }) {
  const [mounted, setMounted] = React.useState(false);
  const [lang, setLang] = React.useState("ar"); // safe placeholder

  React.useEffect(() => {
    setMounted(true);
    setLang(getInitialLang());

    const onLang = () => setLang(getInitialLang());
    window.addEventListener("langChanged", onLang);
    return () => window.removeEventListener("langChanged", onLang);
  }, []);

  if (!mounted) return null; // ✅ avoid hydration mismatch

  if (!options.length) return null;

  const prices = options.map((o) => Number(o.price || 0));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <>
      {min === max
        ? formatCurrency(min, currency, lang)
        : `${formatCurrency(min, currency, lang)} - ${formatCurrency(
            max,
            currency,
            lang
          )}`}
    </>
  );
}
