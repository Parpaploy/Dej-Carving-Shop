"use client";
import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Package, Users, ShoppingCart, Trash2, Edit, Plus, X,
  Image as ImageIcon, Eye, ChevronDown, Phone, MapPin,
  Mail, Calendar, Shield, Search, RefreshCw,
  Check, XCircle, Truck, Clock, CheckCircle, Ban, Save, StickyNote,
  Home, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { IProduct } from "@/app/interfaces/product.interface";
import { useAuth } from "@/app/context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";

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
  const { user, logout } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      const roleName = parsed.role?.name?.toLowerCase();
      if (roleName !== "admin") {
        toast.error(locale === "th" ? "คุณไม่มีสิทธิ์เข้าถึงหน้านี้" : "You do not have permission to access this page");
        router.push("/");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }
    setAuthChecked(true);
  }, [router, locale]);

  const tabs = [
    { key: "orders" as const, label: t("dash.orders"), icon: <ShoppingCart size={20} />, color: "bg-blue-600" },
    { key: "products" as const, label: t("dash.products"), icon: <Package size={20} />, color: "bg-emerald-600" },
    { key: "users" as const, label: t("dash.users"), icon: <Users size={20} />, color: "bg-purple-600" },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 animate-pulse">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">{t("dash.title")}</h1>
          <p className="text-xs text-slate-400 mt-1">{t("common.shopName")}</p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-grow">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                activeTab === tab.key
                  ? `${tab.color} shadow-lg shadow-blue-900/30`
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              {tab.icon} <span className="font-medium">{tab.label}</span>
            </button>
          ))}

          <div className="h-px bg-slate-700 my-4" />

          <a href="/" className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Home size={20} /> <span className="font-medium">{t("nav.home")}</span>
          </a>
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> {t("nav.logout")}
            </button>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-800">{t("dash.title")}</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "products" && <ProductManager />}
          {activeTab === "orders" && <OrderManager />}
          {activeTab === "users" && <UserManager />}
        </main>
      </div>
    </div>
  );
}

// ==================== PRODUCT MANAGER ====================
interface CategoryOption { id: number; documentId?: string; name: string; }

function ProductManager() {
  const { t } = useLocale();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", description: "", categories: [] as number[] });
  const [file, setFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products?populate=*`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const handleDelete = async (product: IProduct) => {
    if (!confirm(t("dash.confirmDelete"))) return;
    const docId = product.documentId || product.id;
    try {
      await axios.delete(`${API}/api/products/${docId}`, { headers: getAuthHeaders() });
      setProducts(products.filter((p) => p.id !== product.id));
      toast.success(t("toast.addressDeleted"));
    } catch {
      toast.error(t("dash.deleteError"));
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
          categories: formData.categories,
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
      toast.success(editingId ? t("dash.updated") : t("dash.saveProduct"));
    } catch (err) {
      console.error(err);
      toast.error(t("dash.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product: IProduct) => {
    setEditingId(product.documentId || product.id);
    setFormData({ name: product.name, price: String(product.price), description: blocksToText(product.description), categories: product.categories?.map((c) => c.id) || [] });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", description: "", categories: [] });
    setFile(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("dash.productMgmt")}</h2>
          <p className="text-sm text-gray-400 mt-1">{products.length} {t("dash.products")}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm font-medium">
          <Plus size={18} /> {t("dash.addProduct")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.image")}</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.name")}</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.category")}</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.price")}</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t("dash.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const raw = p.images?.[0]?.url;
                const imgUrl = raw ? (raw.startsWith("http") ? raw : `${API}${raw}`) : null;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {imgUrl ? (
                        <img src={imgUrl} alt={p.name} className="w-14 h-14 object-cover rounded-lg shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ImageIcon size={22} /></div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4">
                      {p.categories && p.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.categories.map((cat) => (
                            <span key={cat.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">{cat.name}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 italic text-sm">{t("dash.noCategory")}</span>
                      )}
                    </td>
                    <td className="p-4 text-emerald-600 font-bold text-lg">฿{(p.price ?? 0).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:bg-blue-50 p-2.5 rounded-lg transition-colors" title={t("dash.editProduct")}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p)} className="text-red-500 hover:bg-red-50 p-2.5 rounded-lg transition-colors" title={t("dash.delete")}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400">{t("dash.noProducts")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 pt-16 sm:pt-20">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col">
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-base sm:text-lg font-bold">{editingId ? t("dash.editProduct") : t("dash.newProduct")}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.productName")}</label>
                <input className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t("dash.productName")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.price")}</label>
                <input className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" type="number" placeholder="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.category")}</label>
                <div className="flex flex-wrap gap-2 border rounded-lg px-4 py-3">
                  {categories.length > 0 ? categories.map((cat) => (
                    <label key={cat.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${formData.categories.includes(cat.id) ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.categories, cat.id]
                            : formData.categories.filter((id) => id !== cat.id);
                          setFormData({ ...formData, categories: updated });
                        }}
                        className="sr-only"
                      />
                      {cat.name}
                    </label>
                  )) : (
                    <span className="text-sm text-gray-400 italic">{t("dash.noCategory")}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.description")}</label>
                <textarea className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t("dash.description")} rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.productImage")}</label>
                <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:cursor-pointer" />
              </div>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors mt-2">
                {loading ? t("dash.saving") : t("dash.saveProduct")}
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
  transferProofUrl?: string;
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

function OrderManager() {
  const { t, locale } = useLocale();
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
  const [proofModalUrl, setProofModalUrl] = useState<string | null>(null);
  const prevOrderIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: t("dash.pending"),
      paid: t("dash.paid"),
      shipped: t("dash.shipped"),
      delivered: t("dash.delivered"),
      cancelled: t("dash.cancelled"),
    };
    return map[status] || status;
  };

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${API}/api/orders?populate=*&sort=createdAt:desc`, { headers: getAuthHeaders() });
      const fetched: OrderData[] = res.data.data;

      if (!isFirstLoadRef.current) {
        const currentIds = new Set(fetched.map((o) => o.id));
        const brandNew: number[] = [];
        currentIds.forEach((id) => {
          if (!prevOrderIdsRef.current.has(id)) brandNew.push(id);
        });
        if (brandNew.length > 0) {
          setNewOrderIds(new Set(brandNew));
          toast.success(`${brandNew.length} ${t("dash.newOrders")}`);
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
  }, [t]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (editingOrder) return;
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(interval);
  }, [fetchOrders, editingOrder]);

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
      toast.success(`${order.orderNumber} → ${statusLabel(newStatus)}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(t("dash.failedUpdateStatus"));
    }
  };

  const quickAction = async (order: OrderData, newStatus: string) => {
    if (newStatus === "cancelled" && !confirm(`${t("dash.confirmCancel")} ${order.orderNumber}?`)) return;
    await updateStatus(order, newStatus);
  };

  const deleteOrder = async (order: OrderData) => {
    if (!confirm(`${t("dash.confirmDeleteOrder")} ${order.orderNumber}?`)) return;
    const docId = order.documentId || order.id;
    try {
      await axios.delete(`${API}/api/orders/${docId}`, { headers: getAuthHeaders() });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success(`${t("dash.delete")} ${order.orderNumber}`);
    } catch (err) {
      toast.error(t("dash.failedDeleteOrder"));
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
      toast.success(`${editingOrder.orderNumber} ${t("dash.updated")}`);
      setEditingOrder(null);
    } catch (err) {
      toast.error(t("dash.failedSaveOrder"));
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
              onClick={(e) => { e.stopPropagation(); quickAction(order, "paid"); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 active:scale-95 transition-all shadow-sm"
            >
              <Check size={16} /> {t("dash.approve")}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); quickAction(order, "cancelled"); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 active:scale-95 transition-all shadow-sm"
            >
              <Ban size={16} /> {t("dash.reject")}
            </button>
          </div>
        );
      case "paid":
        return (
          <button
            onClick={(e) => { e.stopPropagation(); quickAction(order, "shipped"); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 active:scale-95 transition-all shadow-sm"
          >
            <Truck size={16} /> {t("dash.shipOrder")}
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={(e) => { e.stopPropagation(); quickAction(order, "delivered"); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 active:scale-95 transition-all shadow-sm"
          >
            <CheckCircle size={16} /> {t("dash.markDelivered")}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header with live indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">{t("dash.orderMgmt")}</h2>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-green-700 font-medium">{t("dash.live")}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            {secondsAgo < 5 ? t("dash.justNow") : `${secondsAgo}${t("dash.secondsAgo")}`}
          </span>
          <button onClick={() => fetchOrders()} className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: t("dash.total"), value: orderStats.total, color: "bg-white border-gray-200", icon: <ShoppingCart size={18} className="text-gray-400" /> },
          { label: t("dash.pending"), value: orderStats.pending, color: "bg-yellow-50 border-yellow-200", icon: <Clock size={18} className="text-yellow-500" /> },
          { label: t("dash.paid"), value: orderStats.paid, color: "bg-blue-50 border-blue-200", icon: <Check size={18} className="text-blue-500" /> },
          { label: t("dash.shipped"), value: orderStats.shipped, color: "bg-purple-50 border-purple-200", icon: <Truck size={18} className="text-purple-500" /> },
          { label: t("dash.delivered"), value: orderStats.delivered, color: "bg-green-50 border-green-200", icon: <CheckCircle size={18} className="text-green-500" /> },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-xl p-4 text-center shadow-sm`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("dash.searchOrders")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm font-medium"
        >
          <option value="all">{t("dash.allStatus")}</option>
          <option value="pending">{t("dash.pending")}</option>
          <option value="paid">{t("dash.paid")}</option>
          <option value="shipped">{t("dash.shipped")}</option>
          <option value="delivered">{t("dash.delivered")}</option>
          <option value="cancelled">{t("dash.cancelled")}</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">{t("dash.loadingOrders")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t("dash.noOrders")}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                newOrderIds.has(order.id)
                  ? "border-green-400 ring-2 ring-green-200 animate-pulse"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Row */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    {newOrderIds.has(order.id) && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">{t("dash.new")}</span>
                    )}
                    <p className="font-bold text-gray-800">{order.orderNumber}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {order.user?.username && <span className="text-gray-500 font-medium">{order.user.username} · </span>}
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-sm hidden sm:block">
                  <p className="font-medium text-gray-700">{order.recipientName || "—"}</p>
                  <p className="text-gray-400">{order.phone || ""}</p>
                </div>

                <p className="font-bold text-emerald-700 text-lg">฿{(order.totalAmount ?? 0).toLocaleString()}</p>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabel(order.status)}
                </span>

                <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                  {renderQuickActions(order)}
                </div>

                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="border-t bg-gray-50 p-5 space-y-4">
                  <div className="md:hidden flex justify-center">
                    {renderQuickActions(order)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-400 uppercase mb-1 font-semibold">{t("dash.shippingAddress")}</p>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{order.shippingAddress || t("dash.noAddress")}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-400 uppercase mb-1 font-semibold">{t("dash.contact")}</p>
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
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-400 uppercase mb-1 font-semibold">{t("dash.payment")}</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {order.paymentMethod === "promptpay" ? t("dash.promptpay") : t("dash.bankTransfer")}
                      </p>
                    </div>
                  </div>

                  {order.adminNotes && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1 font-semibold">{t("dash.adminNotes")}</p>
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <StickyNote size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{order.adminNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Transfer Proof */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1 font-semibold">{t("dash.transferProof")}</p>
                    {order.transferProofUrl ? (
                      <button
                        onClick={() => setProofModalUrl(`${API}${order.transferProofUrl}`)}
                        className="inline-block"
                      >
                        <img
                          src={`${API}${order.transferProofUrl}`}
                          alt="Transfer proof"
                          className="max-h-40 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        />
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t("dash.noProof")}</p>
                    )}
                  </div>

                  {order.products && order.products.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">{t("dash.productsInOrder")}</p>
                      <div className="space-y-1">
                        {order.products.map((prod) => (
                          <div key={prod.id} className="flex justify-between text-sm bg-white px-3 py-2 rounded-lg border">
                            <span className="text-gray-700">{prod.name}</span>
                            <span className="text-emerald-600 font-medium">฿{(prod.price ?? 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
                    <button
                      onClick={() => openEdit(order)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={16} /> {t("dash.editOrder")}
                    </button>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-500 font-medium">{t("dash.status")}:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order, e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="pending">{t("dash.pending")}</option>
                        <option value="paid">{t("dash.paid")}</option>
                        <option value="shipped">{t("dash.shipped")}</option>
                        <option value="delivered">{t("dash.delivered")}</option>
                        <option value="cancelled">{t("dash.cancelled")}</option>
                      </select>
                    </div>

                    <div className="flex-grow" />
                    <button
                      onClick={() => deleteOrder(order)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={16} /> {t("dash.delete")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Order Modal */}
      {/* Transfer Proof Modal */}
      {proofModalUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 pt-16 sm:pt-20" onClick={() => setProofModalUrl(null)}>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-base sm:text-lg font-bold">{t("dash.transferProof")}</h3>
              <button onClick={() => setProofModalUrl(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-3 sm:p-4 flex items-center justify-center bg-gray-50 overflow-y-auto">
              <img
                src={proofModalUrl}
                alt="Transfer proof"
                className="max-h-[calc(100vh-10rem)] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 pt-16 sm:pt-20">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col">
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold">{t("dash.editOrder")}</h3>
                <p className="text-slate-400 text-sm">{editingOrder.orderNumber}</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.recipientName")}</label>
                <input
                  type="text"
                  value={editForm.recipientName}
                  onChange={(e) => setEditForm({ ...editForm, recipientName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.phone")}</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.shippingAddress")}</label>
                <textarea
                  rows={3}
                  value={editForm.shippingAddress}
                  onChange={(e) => setEditForm({ ...editForm, shippingAddress: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.paymentMethod")}</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="bank_transfer">{t("dash.bankTransfer")}</option>
                    <option value="promptpay">{t("dash.promptpay")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.status")}</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pending">{t("dash.pending")}</option>
                    <option value="paid">{t("dash.paid")}</option>
                    <option value="shipped">{t("dash.shipped")}</option>
                    <option value="delivered">{t("dash.delivered")}</option>
                    <option value="cancelled">{t("dash.cancelled")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("dash.adminNotes")}</label>
                <textarea
                  rows={2}
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  placeholder={t("dash.internalNotes")}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-yellow-50"
                />
              </div>
            </div>

            <div className="border-t px-6 py-4 flex gap-3 flex-shrink-0">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 py-2.5 border rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t("dash.cancel")}
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
              >
                {editSaving ? t("dash.saving") : <><Save size={18} /> {t("dash.saveChanges")}</>}
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
  const { t, locale } = useLocale();
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
    const msg = u.blocked ? t("dash.confirmUnblockUser") : t("dash.confirmBlockUser");
    if (!confirm(`${msg} (${u.username})`)) return;
    try {
      await axios.put(`${API}/api/users/${u.id}`, { blocked: !u.blocked }, { headers: getAuthHeaders() });
      setUsers(users.map((usr) => (usr.id === u.id ? { ...usr, blocked: !usr.blocked } : usr)));
      setSelectedUser(null);
      toast.success(t("dash.updated"));
    } catch (err) {
      toast.error(t("dash.failedBlockUser"));
    }
  };

  const deleteUser = async (u: UserData) => {
    if (!confirm(t("dash.confirmDeleteUser"))) return;
    try {
      await axios.delete(`${API}/api/users/${u.id}`, { headers: getAuthHeaders() });
      setUsers(users.filter((usr) => usr.id !== u.id));
      setSelectedUser(null);
      toast.success(`${t("dash.delete")} ${u.username}`);
    } catch (err) {
      toast.error(t("dash.failedDeleteUser"));
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("dash.userMgmt")}</h2>
          <p className="text-sm text-gray-400 mt-1">{users.length} {t("dash.registeredUsers")}</p>
        </div>
        <button onClick={fetchUsers} className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t("dash.searchUsers")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">{t("dash.loadingUsers")}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.user")}</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.email")}</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.role")}</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.status")}</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("dash.joined")}</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t("dash.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {u.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-gray-800">{u.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.role?.name === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role?.name || "Authenticated"}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.blocked ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{t("dash.blocked")}</span>
                      ) : u.confirmed ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{t("dash.active")}</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{t("dash.unconfirmed")}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedUser(u)} className="text-blue-500 hover:bg-blue-50 p-2.5 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-gray-400">{t("dash.noUsers")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 pt-16 sm:pt-20">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                <span className="text-sm">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={18} className="text-gray-400" />
                <span className="text-sm">{t("dash.joined")} {new Date(selectedUser.createdAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Shield size={18} className="text-gray-400" />
                <span className="text-sm">
                  {selectedUser.blocked ? t("dash.blocked") : selectedUser.confirmed ? t("dash.confirmedActive") : t("dash.unconfirmed")}
                </span>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => toggleBlock(selectedUser)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    selectedUser.blocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {selectedUser.blocked ? t("dash.unblockUser") : t("dash.blockUser")}
                </button>
                <button
                  onClick={() => deleteUser(selectedUser)}
                  className="flex-1 bg-red-100 text-red-700 py-2.5 rounded-lg font-medium text-sm hover:bg-red-200 transition-colors"
                >
                  {t("dash.deleteUser")}
                </button>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 border rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t("dash.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
