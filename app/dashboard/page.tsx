"use client";
import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Package, Users, ShoppingCart, Trash2, Edit, Plus, X,
  Image as ImageIcon, Eye, ChevronDown, Phone, MapPin,
  Mail, Calendar, Shield, Search, RefreshCw,
  Check, XCircle, Truck, Clock, CheckCircle, Ban, Save, StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { IProduct } from "@/app/interfaces/product.interface";
import { useAuth } from "@/app/context/AuthContext";

const API = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

const textToBlocks = (text: string) => [
  { type: "paragraph", children: [{ type: "text", text }] },
];

const blocksToText = (blocks: unknown) => {
  try {
    return (blocks as any)[0]?.children[0]?.text || "";
  } catch {
    return "";
  }
};

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !localStorage.getItem("user")) {
      router.push("/login");
    }
  }, [router]);

  const tabs = [
    { key: "products" as const, label: "Products", icon: <Package size={20} /> },
    { key: "orders" as const, label: "Orders", icon: <ShoppingCart size={20} /> },
    { key: "users" as const, label: "Users", icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col flex-shrink-0">
        <h1 className="text-xl font-bold mb-8">Dej Admin</h1>
        <nav className="flex flex-col gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === t.key ? "bg-blue-600" : "hover:bg-slate-800"
              }`}
            >
              {t.icon} <span>{t.label}</span>
            </button>
          ))}
        </nav>
        {user && (
          <div className="mt-auto pt-6 border-t border-slate-700 text-sm text-slate-400">
            Logged in as <span className="text-white font-medium">{user.username}</span>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "products" && <ProductManager />}
        {activeTab === "orders" && <OrderManager />}
        {activeTab === "users" && <UserManager />}
      </main>
    </div>
  );
}

// ==================== PRODUCT MANAGER ====================
function ProductManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products?populate=*`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/api/products/${id}`, { headers: getAuthHeaders() });
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Error deleting product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImageId = null;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("files", file);
        const uploadRes = await axios.post(`${API}/api/upload`, uploadData, { headers: getAuthHeaders() });
        uploadedImageId = uploadRes.data[0].id;
      }

      const payload: any = {
        data: {
          name: formData.name,
          price: Number(formData.price),
          description: textToBlocks(formData.description),
        },
      };
      if (uploadedImageId) payload.data.images = [uploadedImageId];

      if (editingId !== null) {
        await axios.put(`${API}/api/products/${editingId}`, payload, { headers: getAuthHeaders() });
      } else {
        await axios.post(`${API}/api/products`, payload, { headers: getAuthHeaders() });
      }
      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product: IProduct) => {
    setEditingId(product.id);
    setFormData({ name: product.name, price: String(product.price), description: blocksToText(product.description) });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", description: "" });
    setFile(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const raw = p.images?.[0]?.url;
              const imgUrl = raw ? (raw.startsWith("http") ? raw : `${API}${raw}`) : null;
              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-green-600 font-bold">฿{(p.price ?? 0).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded mr-2"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{editingId ? "Edit Product" : "New Product"}</h3>
              <button onClick={closeModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input className="border p-3 rounded" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input className="border p-3 rounded" type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              <textarea className="border p-3 rounded" placeholder="Description" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700" />
              </div>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ORDER MANAGER ====================
interface OrderData {
  id: number;
  documentId?: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  recipientName?: string;
  phone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  adminNotes?: string;
  user?: { id: number; username: string; email: string };
  products?: { id: number; name: string; price: number }[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "รอชำระ / Pending",
  paid: "ชำระแล้ว / Paid",
  shipped: "จัดส่งแล้ว / Shipped",
  delivered: "ส่งถึงแล้ว / Delivered",
  cancelled: "ยกเลิก / Cancelled",
};

function OrderManager() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set());
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [editForm, setEditForm] = useState({ recipientName: "", phone: "", shippingAddress: "", paymentMethod: "", status: "", adminNotes: "" });
  const [editSaving, setEditSaving] = useState(false);
  const prevOrderIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${API}/api/orders?populate=*&sort=createdAt:desc`, { headers: getAuthHeaders() });
      const fetched: OrderData[] = res.data.data;

      // Detect new orders (skip on first load)
      if (!isFirstLoadRef.current) {
        const currentIds = new Set(fetched.map((o) => o.id));
        const brandNew: number[] = [];
        currentIds.forEach((id) => {
          if (!prevOrderIdsRef.current.has(id)) brandNew.push(id);
        });
        if (brandNew.length > 0) {
          setNewOrderIds(new Set(brandNew));
          toast.success(`${brandNew.length} คำสั่งซื้อใหม่! / ${brandNew.length} new order(s)!`);
          setTimeout(() => setNewOrderIds(new Set()), 4000);
        }
      }

      prevOrderIdsRef.current = new Set(fetched.map((o) => o.id));
      isFirstLoadRef.current = false;
      setOrders(fetched);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Auto-polling every 15 seconds (pause when editing)
  useEffect(() => {
    if (editingOrder) return;
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(interval);
  }, [fetchOrders, editingOrder]);

  // Seconds-ago ticker
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefreshed.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastRefreshed]);

  const updateStatus = async (order: OrderData, newStatus: string) => {
    const docId = order.documentId || order.id;
    try {
      await axios.put(`${API}/api/orders/${docId}`, { data: { status: newStatus } }, { headers: getAuthHeaders() });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
      toast.success(`${order.orderNumber} → ${STATUS_LABELS[newStatus] || newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update order status");
    }
  };

  const quickAction = async (order: OrderData, newStatus: string, label: string) => {
    if (newStatus === "cancelled" && !confirm(`ยกเลิกคำสั่งซื้อ ${order.orderNumber}? / Cancel order ${order.orderNumber}?`)) return;
    await updateStatus(order, newStatus);
  };

  const deleteOrder = async (order: OrderData) => {
    if (!confirm(`ลบคำสั่งซื้อ ${order.orderNumber}? / Delete order ${order.orderNumber}?`)) return;
    const docId = order.documentId || order.id;
    try {
      await axios.delete(`${API}/api/orders/${docId}`, { headers: getAuthHeaders() });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success(`Deleted ${order.orderNumber}`);
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const openEdit = (order: OrderData) => {
    setEditingOrder(order);
    setEditForm({
      recipientName: order.recipientName || "",
      phone: order.phone || "",
      shippingAddress: order.shippingAddress || "",
      paymentMethod: order.paymentMethod || "bank_transfer",
      status: order.status || "pending",
      adminNotes: order.adminNotes || "",
    });
  };

  const saveEdit = async () => {
    if (!editingOrder) return;
    setEditSaving(true);
    const docId = editingOrder.documentId || editingOrder.id;
    try {
      await axios.put(`${API}/api/orders/${docId}`, { data: editForm }, { headers: getAuthHeaders() });
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? { ...o, ...editForm } : o))
      );
      toast.success(`${editingOrder.orderNumber} updated`);
      setEditingOrder(null);
    } catch (err) {
      toast.error("Failed to update order");
    } finally {
      setEditSaving(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.includes(searchTerm);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const renderQuickActions = (order: OrderData) => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); quickAction(order, "paid", "Approve"); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 active:scale-95 transition-all"
            >
              <Check size={16} /> Approve
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); quickAction(order, "cancelled", "Reject"); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
            >
              <Ban size={16} /> Reject
            </button>
          </div>
        );
      case "paid":
        return (
          <button
            onClick={(e) => { e.stopPropagation(); quickAction(order, "shipped", "Ship"); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 active:scale-95 transition-all"
          >
            <Truck size={16} /> Ship Order
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={(e) => { e.stopPropagation(); quickAction(order, "delivered", "Delivered"); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 active:scale-95 transition-all"
          >
            <CheckCircle size={16} /> Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header with live indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-green-700 font-medium">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            {secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`}
          </span>
          <button onClick={() => fetchOrders()} className="text-gray-500 hover:text-blue-600 p-2 rounded hover:bg-blue-50">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: orderStats.total, color: "bg-gray-50 border-gray-200", icon: <ShoppingCart size={18} className="text-gray-400" /> },
          { label: "Pending", value: orderStats.pending, color: "bg-yellow-50 border-yellow-200", icon: <Clock size={18} className="text-yellow-500" /> },
          { label: "Paid", value: orderStats.paid, color: "bg-blue-50 border-blue-200", icon: <Check size={18} className="text-blue-500" /> },
          { label: "Shipped", value: orderStats.shipped, color: "bg-purple-50 border-purple-200", icon: <Truck size={18} className="text-purple-500" /> },
          { label: "Delivered", value: orderStats.delivered, color: "bg-green-50 border-green-200", icon: <CheckCircle size={18} className="text-green-500" /> },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-lg p-4 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order number, name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No orders found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow border overflow-hidden transition-all ${
                newOrderIds.has(order.id)
                  ? "border-green-400 ring-2 ring-green-200 animate-pulse"
                  : "border-gray-100"
              }`}
            >
              {/* Row */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    {newOrderIds.has(order.id) && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">New</span>
                    )}
                    <p className="font-bold text-gray-800">{order.orderNumber}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-sm hidden sm:block">
                  <p className="font-medium text-gray-700">{order.recipientName || "—"}</p>
                  <p className="text-gray-400">{order.phone || ""}</p>
                </div>

                <p className="font-bold text-green-700 text-lg">฿{(order.totalAmount ?? 0).toLocaleString()}</p>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>

                {/* Quick Actions inline */}
                <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                  {renderQuickActions(order)}
                </div>

                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="border-t bg-gray-50 p-5 space-y-4">
                  {/* Mobile quick actions */}
                  <div className="md:hidden flex justify-center">
                    {renderQuickActions(order)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Shipping Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{order.shippingAddress || "No address"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Contact</p>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone size={16} className="text-gray-400" />
                        <p className="text-sm text-gray-700">{order.phone || "—"}</p>
                      </div>
                      {order.user && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <p className="text-sm text-gray-700">{order.user.email}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Payment</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {order.paymentMethod === "promptpay" ? "PromptPay" : "Bank Transfer"}
                      </p>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {order.adminNotes && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Admin Notes</p>
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <StickyNote size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{order.adminNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Products in order */}
                  {order.products && order.products.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-2">Products</p>
                      <div className="space-y-1">
                        {order.products.map((prod) => (
                          <div key={prod.id} className="flex justify-between text-sm bg-white px-3 py-2 rounded border">
                            <span className="text-gray-700">{prod.name}</span>
                            <span className="text-green-600 font-medium">฿{(prod.price ?? 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
                    <button
                      onClick={() => openEdit(order)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={16} /> Edit Order
                    </button>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-500">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order, e.target.value)}
                        className="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex-grow" />
                    <button
                      onClick={() => deleteOrder(order)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== EDIT ORDER MODAL ===== */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold">Edit Order</h3>
                <p className="text-slate-400 text-sm">{editingOrder.orderNumber}</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={editForm.recipientName}
                  onChange={(e) => setEditForm({ ...editForm, recipientName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea
                  rows={3}
                  value={editForm.shippingAddress}
                  onChange={(e) => setEditForm({ ...editForm, shippingAddress: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="promptpay">PromptPay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  placeholder="Internal notes (not visible to customer)"
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-yellow-50"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex gap-3 flex-shrink-0">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 py-2.5 border rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
              >
                {editSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== USER MANAGER ====================
interface UserData {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  role?: { id: number; name: string };
}

function UserManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/users?populate=role`, { headers: getAuthHeaders() });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (u: UserData) => {
    const action = u.blocked ? "unblock" : "block";
    if (!confirm(`${action} user ${u.username}?`)) return;
    try {
      await axios.put(`${API}/api/users/${u.id}`, { blocked: !u.blocked }, { headers: getAuthHeaders() });
      setUsers(users.map((usr) => (usr.id === u.id ? { ...usr, blocked: !usr.blocked } : usr)));
      setSelectedUser(null);
    } catch (err) {
      alert(`Failed to ${action} user`);
    }
  };

  const deleteUser = async (u: UserData) => {
    if (!confirm(`Permanently delete user ${u.username}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/users/${u.id}`, { headers: getAuthHeaders() });
      setUsers(users.filter((usr) => usr.id !== u.id));
      setSelectedUser(null);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-400">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="text-gray-500 hover:text-blue-600 p-2 rounded hover:bg-blue-50">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {u.username?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium">{u.username}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.role?.name === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role?.name || "Authenticated"}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.blocked ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">Blocked</span>
                    ) : u.confirmed ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Unconfirmed</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedUser(u)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">
                {selectedUser.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h3 className="text-xl font-bold">{selectedUser.username}</h3>
              <p className="text-slate-400 text-sm">{selectedUser.role?.name || "Authenticated"}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} className="text-gray-400" />
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={18} className="text-gray-400" />
                <span>Joined {new Date(selectedUser.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Shield size={18} className="text-gray-400" />
                <span>
                  {selectedUser.blocked ? "Blocked" : selectedUser.confirmed ? "Confirmed & Active" : "Unconfirmed"}
                </span>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => toggleBlock(selectedUser)}
                  className={`flex-1 py-2.5 rounded font-medium text-sm ${
                    selectedUser.blocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {selectedUser.blocked ? "Unblock User" : "Block User"}
                </button>
                <button
                  onClick={() => deleteUser(selectedUser)}
                  className="flex-1 bg-red-100 text-red-700 py-2.5 rounded font-medium text-sm hover:bg-red-200"
                >
                  Delete User
                </button>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 border rounded font-medium text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
