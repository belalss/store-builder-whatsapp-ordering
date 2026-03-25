// lib/storage/catalogStore.file.js
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "catalog");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");

/** ensure data/catalog exists + products.json exists */
async function ensureProductsFile() {
  try {
    await fs.access(PRODUCTS_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(PRODUCTS_PATH, "[]", "utf8");
  }
}

async function readProducts() {
  await ensureProductsFile();
  const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeProducts(products) {
  await ensureProductsFile();

  const tmp = PRODUCTS_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(products, null, 2), "utf8");
  await fs.rename(tmp, PRODUCTS_PATH);
}

/** ensure data/catalog exists + categories.json exists */
async function ensureCategoriesFile() {
  try {
    await fs.access(CATEGORIES_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CATEGORIES_PATH, "[]", "utf8");
  }
}

async function readCategories() {
  await ensureCategoriesFile();
  const raw = await fs.readFile(CATEGORIES_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCategories(categories) {
  await ensureCategoriesFile();

  // atomic write
  const tmp = CATEGORIES_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(categories, null, 2), "utf8");
  await fs.rename(tmp, CATEGORIES_PATH);
}

/** simple lock (same idea as ordersStore) */
let writeLock = Promise.resolve();
function withWriteLock(fn) {
  writeLock = writeLock.then(fn, fn);
  return writeLock;
}

/** PUBLIC API: Categories */
async function listCategories() {
  const cats = await readCategories();
  return cats
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function createCategory(input) {
  return withWriteLock(async () => {
    const cats = await readCategories();

    const id =
      (globalThis.crypto?.randomUUID?.() ?? null) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const now = new Date().toISOString();

    const cat = {
      id,
      slug: String(input?.slug || "").trim(),
      name_ar: String(input?.name_ar || "").trim(),
      name_en: String(input?.name_en || "").trim(),
      active: input?.active !== false, // default true
      sortOrder: Number.isFinite(input?.sortOrder) ? input.sortOrder : 0,
      createdAt: now,
      updatedAt: now,
    };

    // basic validation
    if (!cat.slug) throw new Error("slug is required");
    if (!cat.name_ar && !cat.name_en) throw new Error("name_ar or name_en is required");

    // unique slug
    const slugTaken = cats.some((c) => c.slug === cat.slug);
    if (slugTaken) throw new Error("slug already exists");

    cats.push(cat);
    await writeCategories(cats);
    return cat;
  });
}

async function updateCategory(id, patch) {
  return withWriteLock(async () => {
    const cats = await readCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const current = cats[idx];
    const now = new Date().toISOString();

    // compute next values
    const nextSlug =
      patch?.slug != null ? String(patch.slug).trim() : current.slug;

    if (!nextSlug) throw new Error("slug cannot be empty");

    // unique slug check if changed
    const slugTaken = cats.some((c) => c.id !== id && c.slug === nextSlug);
    if (slugTaken) throw new Error("slug already exists");

    cats[idx] = {
      ...current,
      slug: nextSlug,
      name_ar: patch?.name_ar != null ? String(patch.name_ar).trim() : current.name_ar,
      name_en: patch?.name_en != null ? String(patch.name_en).trim() : current.name_en,
      active: patch?.active != null ? !!patch.active : current.active,
      sortOrder:
        patch?.sortOrder != null && Number.isFinite(patch.sortOrder)
          ? patch.sortOrder
          : current.sortOrder,
      updatedAt: now,
    };

    await writeCategories(cats);
    return cats[idx];
  });
}

async function deleteCategory(id) {
  return withWriteLock(async () => {
    const cats = await readCategories();
    const before = cats.length;
    const next = cats.filter((c) => c.id !== id);

    if (next.length === before) return false;

    await writeCategories(next);
    return true;
  });
}

async function listProducts() {
  const products = await readProducts();
  return products;
}

async function createProduct(input) {
  return withWriteLock(async () => {
    const products = await readProducts();

    const id =
      (globalThis.crypto?.randomUUID?.() ?? null) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const now = new Date().toISOString();

    const slug = String(input?.slug || "").trim();
    const categorySlug = String(input?.categorySlug || "").trim();
    const name = String(input?.name || "").trim();

    // basic validation
    if (!slug) throw new Error("slug is required");
    if (!categorySlug) throw new Error("categorySlug is required");
    if (!name) throw new Error("name is required");

    // unique slug
    const slugTaken = products.some((p) => p.slug === slug);
    if (slugTaken) throw new Error("slug already exists");

    // normalize options
    const optionsRaw = Array.isArray(input?.options) ? input.options : [];
    const options = optionsRaw.map((o) => ({
      label: String(o?.label || "").trim(),
      price: Number(o?.price ?? 0),
    }));

    // If options exist, each must have label and valid price
    for (const opt of options) {
      if (!opt.label) throw new Error("Each option must have a label");
      if (!Number.isFinite(opt.price)) throw new Error("Each option must have a numeric price");
    }

    // normalize images
    const imagesRaw = Array.isArray(input?.images) ? input.images : [];
    const images = imagesRaw.map((s) => String(s || "").trim()).filter(Boolean);

    const product = {
      id,
      slug,
      categorySlug,
      name,

      taxable: input?.taxable !== false, // default true
      description: String(input?.description || "").trim(),
      images,
      featured: !!input?.featured,
      options,

      active: input?.active !== false, // default true (store can ignore if not using)
      createdAt: now,
      updatedAt: now,
    };

    products.push(product);
    await writeProducts(products);
    return product;
  });
}

async function updateProduct(id, patch) {
  return withWriteLock(async () => {
    const products = await readProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const current = products[idx];
    const now = new Date().toISOString();

    // slug changes must remain unique
    const nextSlug =
      patch?.slug != null ? String(patch.slug).trim() : current.slug;
    if (!nextSlug) throw new Error("slug cannot be empty");

    const slugTaken = products.some((p) => p.id !== id && p.slug === nextSlug);
    if (slugTaken) throw new Error("slug already exists");

    const nextCategorySlug =
      patch?.categorySlug != null
        ? String(patch.categorySlug).trim()
        : current.categorySlug;

    if (!nextCategorySlug) throw new Error("categorySlug cannot be empty");

    const nextName =
      patch?.name != null ? String(patch.name).trim() : current.name;
    if (!nextName) throw new Error("name cannot be empty");

    // options (if provided)
    let nextOptions = current.options;
    if (patch?.options != null) {
      const optionsRaw = Array.isArray(patch.options) ? patch.options : [];
      nextOptions = optionsRaw.map((o) => ({
        label: String(o?.label || "").trim(),
        price: Number(o?.price ?? 0),
      }));

      for (const opt of nextOptions) {
        if (!opt.label) throw new Error("Each option must have a label");
        if (!Number.isFinite(opt.price)) throw new Error("Each option must have a numeric price");
      }
    }

    // images (if provided)
    let nextImages = current.images;
    if (patch?.images != null) {
      const imagesRaw = Array.isArray(patch.images) ? patch.images : [];
      nextImages = imagesRaw.map((s) => String(s || "").trim()).filter(Boolean);
    }

    products[idx] = {
      ...current,
      slug: nextSlug,
      categorySlug: nextCategorySlug,
      name: nextName,

      taxable: patch?.taxable != null ? !!patch.taxable : current.taxable,
      description: patch?.description != null ? String(patch.description).trim() : current.description,
      featured: patch?.featured != null ? !!patch.featured : current.featured,
      active: patch?.active != null ? !!patch.active : current.active,
      options: nextOptions,
      images: nextImages,

      updatedAt: now,
    };

    await writeProducts(products);
    return products[idx];
  });
}

async function deleteProduct(id) {
  return withWriteLock(async () => {
    const products = await readProducts();
    const before = products.length;
    const next = products.filter((p) => p.id !== id);

    if (next.length === before) return false;

    await writeProducts(next);
    return true;
  });
}


export default {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  // products
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
