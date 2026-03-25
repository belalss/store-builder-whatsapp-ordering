// lib/adminAuth.js
import { NextResponse } from "next/server";

export function requireAdminPin(req) {
  const expected = process.env.ADMIN_PIN;

  // Fail-safe: if pin isn't set, block writes
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PIN is not set on server" },
      { status: 500 }
    );
  }

  const pin = req.headers.get("x-admin-pin");

  if (pin !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // means: ok, continue
}
