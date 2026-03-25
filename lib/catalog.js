// lib/catalog.js
import { promises as fs } from "fs";
import path from "path";

const CATEGORIES_PATH = path.join(process.cwd(), "data", "catalog", "categories.json");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "catalog", "products.json");

async function readJsonArray(filePath) {
  try {
    const txt = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(txt);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getCategories() {
  return readJsonArray(CATEGORIES_PATH);
}

export async function getProducts() {
  return readJsonArray(PRODUCTS_PATH);
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getProductsByCategorySlug(categorySlug) {
  const products = await getProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}
