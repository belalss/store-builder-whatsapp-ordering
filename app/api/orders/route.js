import { NextResponse } from "next/server";
import ordersStore from "@/lib/storage/ordersStore";

const ALLOWED_STATUSES = ["new", "confirmed", "done", "cancelled"];

export async function GET() {
  const orders = await ordersStore.list();
  return NextResponse.json({ orders });
}

export async function POST(req) {
  const order = await req.json();

  const saved = await ordersStore.create(order);

  return NextResponse.json({ order: saved }, { status: 201 });
}

export async function PATCH(req) {
  const body = await req.json();
  const { id, status } = body || {};

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 }
    );
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status", allowed: ALLOWED_STATUSES },
      { status: 400 }
    );
  }

  const updated = await ordersStore.updateStatus(id, status);

  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: updated });
}
