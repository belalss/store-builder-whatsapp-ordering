import Link from "next/link";
import { getCategories, getProductBySlug, getProducts } from "@/lib/catalog";
import ProductClient from "./ProductClient";

export const revalidate = 0;

export default async function ProductPage({ params }) {
  const {slug} = await params;

  const categories = await getCategories();
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="container page">
        <h1>Product not found</h1>
        <Link href="/">Back home</Link>
      </div>
    );
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug
    )
    .slice(0, 6);

  return (
    <ProductClient
      product={product}
      related={related}
      categories={categories}
    />
  );
}
