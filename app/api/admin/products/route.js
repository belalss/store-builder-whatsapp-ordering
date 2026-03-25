import { NextResponse } from "next/server";
import catalogStore from "@/lib/storage/catalogStore";
import { requireAdminPin } from "@/lib/adminAuth";

export async function GET() {
  const products = await catalogStore.listProducts();
  return NextResponse.json({ products });
}

export async function POST(req) {
  const auth = requireAdminPin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const product = await catalogStore.createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
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
    const { id, patch } = body || {};

    if (!id || !patch) {
      return NextResponse.json({ error: "Missing id or patch" }, { status: 400 });
    }

    const updated = await catalogStore.updateProduct(id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
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
    const { id } = body || {};

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const ok = await catalogStore.deleteProduct(id);

    if (!ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Bad request" },
      { status: 400 }
    );
  }
}
