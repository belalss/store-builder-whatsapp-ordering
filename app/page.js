import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/money";
import { STORE } from "@/lib/store";
import { getInitialLang } from "@/lib/i18n";
import PriceRangeClient from "@/components/PriceRangeClient";
export const revalidate = 0; // always read latest JSON (dev/admin json)

function getPriceRange(options = [], currency, lang = "ar") {
  if (!options.length) return "";
  const prices = options.map((o) => Number(o.price || 0));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
   return min === max
    ? formatCurrency(min, currency, lang)
    : `${formatCurrency(min, currency, lang)} - ${formatCurrency(max, currency, lang)}`;
}

export default async function Home() {
  const categories = await getCategories();
  const featured = await getFeaturedProducts();
  const lang = getInitialLang();
  return (
    <div className="container page">
      <div className="header">
        <h1 style={{ margin: 0 }}>البشاواتي</h1>
      </div>

      {/* Categories */}
      <h2 style={{ marginTop: 10 }}>Categories</h2>

      <div className="catRow">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className="catCard">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.title || cat.name || cat.slug}
                className="product-imagecat"
              />
            ) : null}

            <div className="catTitle">{cat.title || cat.name}</div>
            <div className="catDesc">{cat.description || ""}</div>
          </Link>
        ))}
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <>
          <h2 style={{ marginTop: 28 }}>Featured Products</h2>

          <div className="grid">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {p.featured ? <div className="badge">⭐ Featured</div> : null}

                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="product-image"
                  style={{ borderRadius: 12 }}
                />

                <h3 style={{ marginTop: 10, marginBottom: 6 }}>{p.name}</h3>
                <p className="desc">{p.description}</p>

                <div style={{ marginTop: "auto", fontWeight: 700 }}>
                 <PriceRangeClient options={p.options} currency={STORE.currency} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
