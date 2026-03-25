// lib/storage/ordersStore.js

import fileStore from "./ordersStore.file";

// Later you will do:
// import dbStore from "./ordersStore.db";

const USE_DB = process.env.ORDERS_STORE === "db";

/**
 * The API will import this default export.
 * We return an object that has list/create/updateStatus.
 */
const ordersStore = USE_DB
  ? (() => {
      throw new Error("DB store not implemented yet. Set ORDERS_STORE=file.");
      // return dbStore;
    })()
  : fileStore;

export default ordersStore;
