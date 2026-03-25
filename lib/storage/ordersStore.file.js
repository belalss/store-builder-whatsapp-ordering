// lib/storage/ordersStore.file.js

import fs from "fs/promises";
import path from "path";

/**
 * Where orders are stored.
 * path.join(process.cwd(), ...) means: from your project root.
 */
const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

/**
 * Simple in-process mutex to avoid two writes at the exact same time.
 * (Good enough for local/dev. Later DB will solve this properly.)
 */
let writeLock = Promise.resolve();
function withWriteLock(fn) {
  writeLock = writeLock.then(fn, fn);
  return writeLock;
}

async function ensureFileExists() {
  try {
    await fs.access(ORDERS_PATH);
  } catch {
    // If file doesn't exist, create folder + file with empty array
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, "[]", "utf8");
  }
}

async function readAll() {
  await ensureFileExists();
  const raw = await fs.readFile(ORDERS_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If JSON got corrupted, fallback safely
    return [];
  }
}

async function writeAll(orders) {
  await ensureFileExists();

  // Write atomically: write temp then rename
  const tmpPath = ORDERS_PATH + ".tmp";
  const json = JSON.stringify(orders, null, 2);

  await fs.writeFile(tmpPath, json, "utf8");
  await fs.rename(tmpPath, ORDERS_PATH);
}

/**
 * Public API (the adapter contract)
 */
async function list() {
  // newest first is often nicer in admin
  const orders = await readAll();
  return orders.slice().reverse();
}

async function create(order) {
  return withWriteLock(async () => {
    const orders = await readAll();

    // Generate a stable id for file storage
    // Later DB will generate IDs, but adapter keeps same API.
    const id =
      (globalThis.crypto?.randomUUID?.() ?? null) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const now = new Date().toISOString();

    const saved = {
      id,
      status: "new",
      createdAt: now,
      updatedAt: now,
      ...order, // your canonical order object
    };

    orders.push(saved);
    await writeAll(orders);
   

    return saved;
  });
}

async function updateStatus(id, status) {
  return withWriteLock(async () => {
    const orders = await readAll();

    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    orders[idx] = {
      ...orders[idx],
      status,
      updatedAt: now,
    };

    await writeAll(orders);
    return orders[idx];
  });
}

const fileStore = { list, create, updateStatus };
export default fileStore;
