// app/api/admin/categories/route.js
import { NextResponse } from "next/server";
import catalogStore from "@/lib/storage/catalogStore";
import { requireAdminPin } from "@/lib/adminAuth";

export async function GET() {
  const categories = await catalogStore.listCategories();
  return NextResponse.json({ categories });
}

export async function POST(req) {
  const auth = requireAdminPin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const category = await catalogStore.createCategory(body);
    return NextResponse.json({ category }, { status: 201 });
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

    const updated = await catalogStore.updateCategory(id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category: updated });
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

    const ok = await catalogStore.deleteCategory(id);

    if (!ok) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Bad request" },
      { status: 400 }
    );
  }
}
