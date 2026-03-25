// lib/storage/catalogStore.js
import fileStore from "./catalogStore.file";

const USE_DB = process.env.CATALOG_STORE === "db";

const catalogStore = USE_DB
  ? (() => {
      throw new Error("DB catalog store not implemented yet. Set CATALOG_STORE=file.");
    })()
  : fileStore;

export default catalogStore;
