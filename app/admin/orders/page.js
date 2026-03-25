import OrdersClient from "./OrdersClient";

export const revalidate = 0;

async function fetchOrders() {
  try {
    // On the server, it's safest to use an absolute URL.
    // Put NEXT_PUBLIC_BASE_URL=http://localhost:3000 in .env.local
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/orders`, { cache: "no-store" });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data.orders) ? data.orders : [];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await fetchOrders();

  return (
    <div className="container page">
      <h1>Admin – Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <OrdersClient initialOrders={orders} />
      )}
    </div>
  );
}
