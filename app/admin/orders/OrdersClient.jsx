"use client";

import React from "react";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

function statusStyle(status) {
  // simple inline “badge” styles
  if (status === "new") return { background: "#eef2ff", color: "#3730a3" };
  if (status === "confirmed") return { background: "#ecfdf5", color: "#065f46" };
  if (status === "done") return { background: "#f0fdf4", color: "#166534" };
  if (status === "cancelled") return { background: "#fef2f2", color: "#991b1b" };
  return { background: "#f3f4f6", color: "#111827" };
}

export default function OrdersClient({ initialOrders }) {
  const [orders, setOrders] = React.useState(initialOrders || []);
  const [savingId, setSavingId] = React.useState("");

  // ✅ filter UI state
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [q, setQ] = React.useState("");

  async function setStatus(id, status) {
  try {
    setSavingId(id);

    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    // If server responded with 400/404/500 etc.
    if (!res.ok) {
      let msg = "Failed";
      try {
        const err = await res.json();
        msg = err.error || msg;
      } catch {}
      alert(msg);
      return;
    }

    const data = await res.json(); // expected: { order: updatedOrder }

    // update UI without refresh
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: data.order.status, updatedAt: data.order.updatedAt }
          : o
      )
    );
  } finally {
    setSavingId("");
  }
}


  // ✅ filtering + search
  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return orders.filter((o) => {
      const statusOk = statusFilter === "all" ? true : o.status === statusFilter;

      if (!query) return statusOk;

      const orderNo = String(o.orderNumber || "").toLowerCase();
      const name = String(o.customer?.name || "").toLowerCase();
      const phone = String(o.customer?.phone || "").toLowerCase();

      const matches =
        orderNo.includes(query) || name.includes(query) || phone.includes(query);

      return statusOk && matches;
    });
  }, [orders, statusFilter, q]);

  // ✅ show latest first
  const list = filtered.slice().reverse();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          padding: 12,
          border: "1px solid #eee",
          borderRadius: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>Filters</div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 10 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: order # / phone / name"
          style={{
            flex: 1,
            minWidth: 220,
            padding: 8,
            border: "1px solid #ddd",
            borderRadius: 10,
          }}
        />

        <div style={{ opacity: 0.7 }}>
          Showing: <b>{list.length}</b>
        </div>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No matching orders.</p>
      ) : (
        list.map((o) => (
          <div
            key={o.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>#{o.orderNumber || "—"}</div>

              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  ...statusStyle(o.status),
                }}
              >
                {o.status || "new"}
              </span>
            </div>

            <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
              {o.createdAt}
              {o.updatedAt ? ` • updated: ${o.updatedAt}` : ""}
            </div>

            <div style={{ marginTop: 8 }}>
              <div>
                <b>Name:</b> {o.customer?.name}
              </div>
              <div>
                <b>Phone:</b> {o.customer?.phone}
              </div>
              <div>
                <b>Total:</b> {o.totals?.grandTotal ?? o.grandTotal ?? "—"}
              </div>
              <div>
                <b>Items:</b> {o.items?.length || 0}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button
                className="btn"
                disabled={savingId === o.id}
                onClick={() => setStatus(o.id, "confirmed")}
              >
                Confirm
              </button>

              <button
                className="btn"
                disabled={savingId === o.id}
                onClick={() => setStatus(o.id, "done")}
              >
                Done
              </button>

              <button
                className="btn"
                disabled={savingId === o.id}
                onClick={() => setStatus(o.id, "cancelled")}
              >
                Cancel
              </button>

              <div style={{ flex: 1 }} />

              <button
                className="btn"
                type="button"
                onClick={() => {
                  // quick copy phone
                  const phone = o.customer?.phone || "";
                  if (phone) navigator.clipboard?.writeText(phone);
                }}
              >
                Copy phone
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
