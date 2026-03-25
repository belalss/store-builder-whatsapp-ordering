import { NextResponse } from "next/server";
import promosStore from "@/lib/storage/promosStore.file";
import { requireAdminPin } from "@/lib/adminAuth";

export async function GET() {
  const promos = await promosStore.listPromos();
  return NextResponse.json({ promos });
}

export async function POST(req) {
  const auth = requireAdminPin(req);
  if (auth) return auth;

  try {
    const body = await req.json();

    const promo = await promosStore.createPromo(body);

    return NextResponse.json(
      { promo },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Bad request" },
      { status: 400 }
    );
  }
}

export async function PATCH(req) {
  const auth = requireAdminPin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const { code, patch } = body || {};

    if (!code || !patch) {
      return NextResponse.json(
        { error: "Missing code or patch" },
        { status: 400 }
      );
    }

    const updated = await promosStore.updatePromo(code, patch);

    if (!updated) {
      return NextResponse.json(
        { error: "Promo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ promo: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Bad request" },
      { status: 400 }
    );
  }
}
export async function DELETE(req) {
  const auth = requireAdminPin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const { code } = body || {};

    if (!code) {
      return NextResponse.json(
        { error: "Missing code" },
        { status: 400 }
      );
    }

    const ok = await promosStore.deletePromo(code);

    if (!ok) {
      return NextResponse.json(
        { error: "Promo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Bad request" },
      { status: 400 }
    );
  }
}