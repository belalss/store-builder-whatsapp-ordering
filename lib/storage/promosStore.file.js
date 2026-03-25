import fs from "fs/promises";
import path from "path";

const PROMOS_PATH = path.join(process.cwd(), "data", "promos.json");

async function ensurePromosFile() {
  try {
    await fs.access(PROMOS_PATH);
  } catch {
    await fs.mkdir(path.dirname(PROMOS_PATH), { recursive: true });
    await fs.writeFile(PROMOS_PATH, "[]", "utf8");
  }
}

async function readPromos() {
  await ensurePromosFile();
  const raw = await fs.readFile(PROMOS_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function listPromos() {
  return await readPromos();
}

async function createPromo(input) {
  const promos = await readPromos();

  const promo = {
    code: String(input?.code || "").trim(),
    type: String(input?.type || "").trim(),
    value: Number(input?.value || 0),
    active: input?.active !== false,
  };

  if (!promo.code) throw new Error("code is required");
  if (!promo.type) throw new Error("type is required");

  promos.push(promo);

  await fs.writeFile(PROMOS_PATH, JSON.stringify(promos, null, 2), "utf8");

  return promo;
}
async function updatePromo(code, patch) {
  const promos = await readPromos();
  const idx = promos.findIndex((p) => p.code === code);

  if (idx === -1) return null;

  const current = promos[idx];

  const nextCode =
    patch?.code != null ? String(patch.code).trim() : current.code;

  const nextType =
    patch?.type != null ? String(patch.type).trim() : current.type;

  const nextValue =
    patch?.value != null ? Number(patch.value) : current.value;

  if (!nextCode) throw new Error("code cannot be empty");
  if (!nextType) throw new Error("type cannot be empty");
  if (!Number.isFinite(nextValue)) throw new Error("value must be numeric");

  promos[idx] = {
    ...current,
    code: nextCode,
    type: nextType,
    value: nextValue,
    active: patch?.active != null ? !!patch.active : current.active,
  };

  await fs.writeFile(PROMOS_PATH, JSON.stringify(promos, null, 2), "utf8");

  return promos[idx];
}
async function deletePromo(code) {
  const promos = await readPromos();
  const next = promos.filter((p) => p.code !== code);

  if (next.length === promos.length) return false;

  await fs.writeFile(PROMOS_PATH, JSON.stringify(next, null, 2), "utf8");

  return true;
}
export default {
  listPromos,
  createPromo,
  updatePromo,
  deletePromo,
};