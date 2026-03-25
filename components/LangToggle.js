"use client";

import React from "react";
import { LANGS } from "@/lib/i18n";

export default function LangToggle({ lang, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        type="button"
        className="btn"
        onClick={() => onChange("ar")}
        style={{ fontWeight: lang === "ar" ? 800 : 400 }}
      >
        {LANGS.ar.label}
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => onChange("en")}
        style={{ fontWeight: lang === "en" ? 800 : 400 }}
      >
        {LANGS.en.label}
      </button>
    </div>
  );
}
