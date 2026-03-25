"use client";

import React from "react";
import { LANGS } from "@/lib/i18n";

export default function HtmlLangSync({ lang }) {
  React.useEffect(() => {
    const info = LANGS[lang] || LANGS.ar;
    document.documentElement.lang = info.code;
    document.documentElement.dir = info.dir;
  }, [lang]);

  return null;
}
