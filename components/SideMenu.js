"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SideMenu({ categories = [] }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/category/")
    ? pathname.split("/category/")[1]?.split("/")[0]
    : null;

  const panelRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;

    const onMouseDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div className="menuWrap">
      <button
        className="menuBtn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        type="button"
      >
        ☰
      </button>

      {open && (
        <div ref={panelRef} className="menuDropdown">
          {/*<div className="menuDropdown">*/}
          <div className="menuSection">
            <div className="menuTitle">الأقسام</div>
            <div className="menuLinks">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className={`menuLink ${activeSlug === c.slug ? "menuLinkActive" : ""}`}
                >
                  {c.title}
                </Link>

              ))}
            </div>
          </div>

          <div className="menuSection">
            <div className="menuTitle">صفحات الموقع</div>
            <div className="menuLinks">
              <Link className="menuLink" href="/about">عنّا</Link>
              <Link className="menuLink" href="/contact">تواصل</Link>
              <Link className="menuLink" href="/delivery">التوصيل</Link>
              <Link className="menuLink" href="/returns">الاسترجاع</Link>
            </div>
          </div>

          <div className="menuSection">
            <div className="menuTitle">السياسات</div>
            <div className="menuLinks">
              <Link className="menuLink" href="/privacy">الخصوصية</Link>
              <Link className="menuLink" href="/terms">الشروط</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
