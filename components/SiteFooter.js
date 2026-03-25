import Link from "next/link";
import { STORE } from "@/lib/store";

export default function SiteFooter() {
  const waLink = `https://wa.me/${STORE.whatsapp}`;

  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        {/* Left side */}
        <div className="footerBrand">
          <img src="/logo.png" alt={STORE.name} style={{ height: 40 }} />


          <div className="footerNote">
            📞 {STORE.phone}
          </div>

          <div className="footerNote">
            🕒 {STORE.hours}
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ marginTop: 10, display: "inline-block" }}
          >
            تواصل عبر واتساب
          </a>
        </div>

        {/* Right side */}
        <div className="footerLinks">
          <Link className="footerLink" href="/about">عنّا</Link>
          <Link className="footerLink" href="/contact">تواصل</Link>
          <Link className="footerLink" href="/delivery">التوصيل</Link>
          <Link className="footerLink" href="/returns">الاسترجاع</Link>
          <Link className="footerLink" href="/privacy">الخصوصية</Link>
          <Link className="footerLink" href="/terms">الشروط</Link>
        </div>
      </div>

      <div className="footerBottom">
        © {new Date().getFullYear()} {STORE.name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
