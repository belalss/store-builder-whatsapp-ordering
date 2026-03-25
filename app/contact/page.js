export const metadata = { title: "Contact | البشاواتي" };

const CONTACT = {
  whatsapp: "962799304026",
  phone: "0799304026",
  address: "عمّان - الأردن",
  hours: "يومياً 10:00 صباحاً - 11:00 مساءً",
};

export default function ContactPage() {
  const waLink = `https://wa.me/${CONTACT.whatsapp}`;
  return (
    <div className="container page">
      <h1>تواصل معنا</h1>

      <div className="card" style={{ gap: 10 }}>
        <div><strong>الهاتف:</strong> {CONTACT.phone}</div>
        <div><strong>واتساب:</strong> {CONTACT.whatsapp}</div>
        <div><strong>العنوان:</strong> {CONTACT.address}</div>
        <div><strong>ساعات العمل:</strong> {CONTACT.hours}</div>

        <a className="btn" href={waLink} target="_blank" rel="noreferrer">
          فتح واتساب
        </a>
      </div>
    </div>
  );
}
