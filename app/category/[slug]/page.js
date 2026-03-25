import Link from "next/link";
import { getCategories, getProductsByCategorySlug } from "@/lib/catalog";

import { STORE } from "@/lib/store";
import PriceRangeClient from "@/components/PriceRangeClient";

export const revalidate = 0;

export default async function CategoryPage({ params }) {
  const {slug} = await params ;

  const categories = await getCategories();
  const products = await getProductsByCategorySlug(slug);
  
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="container">
        <h2>Category not found</h2>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>{category.title || category.name}</h1>
          <p className="desc" style={{ marginTop: 8 }}>
            {category.description || ""}
          </p>
        </div>
      </div>

      {/* Category quick navigation */}
      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        <Link href="/" className="backLink">
          🏠 Home
        </Link>
      </div>

      <div className="productCatRow">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`productCatCard ${c.slug === slug ? "active" : ""}`}
          >
            {c.image ? (
              <img
                src={c.image}
                alt={c.title || c.name || c.slug}
                className="product-imagecat"
              />
            ) : null}

            <div className="productCatTitle">{c.title || c.name}</div>
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          No products in this category yet.
        </p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={p.images?.[0]} alt={p.name} className="product-image" />

              <h3 style={{ marginTop: 10, marginBottom: 6 }}>{p.name}</h3>
              <p className="desc">{p.description}</p>

              <div style={{ marginTop: "auto", fontWeight: 700 }}>
               <PriceRangeClient options={p.options} currency={STORE.currency} />

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
