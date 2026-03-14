"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Mail, Calendar, MapPin, Package, LogOut, Plus, Edit2, Trash2, CheckCircle, Clock, Loader2, Camera, X, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";
import { toast } from "sonner";
import PostalCodeLookup from "../components/ui/PostalCodeLookup";

const API = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

interface AddressForm {
  type: string;
  recipient_name: string;
  phone_num: string;
  full_address: string;
}

const emptyAddress: AddressForm = {
  type: "Home",
  recipient_name: "",
  phone_num: "",
  full_address: "",
};

export default function ProfileClient() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "addresses">("info");

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Username edit state
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !localStorage.getItem("user")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const meRes = await axios.get(`${API}/api/users/me`, config);
        const meData = meRes.data;
        if (meData.profileImage) {
          const imgUrl = meData.profileImage.startsWith("http")
            ? meData.profileImage
            : `${API}${meData.profileImage}`;
          if (imgUrl !== user?.profileImage) {
            updateUser({ profileImage: imgUrl });
          }
        }

        const ordersRes = await axios.get(
          `${API}/api/orders?filters[user][id][$eq]=${user?.id}&sort=createdAt:desc`,
          config
        );
        const addressRes = await axios.get(
          `${API}/api/addresses?filters[user][id][$eq]=${user?.id}`,
          config
        );

        setOrders(ordersRes.data.data);
        setAddresses(addressRes.data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, router]);

  // --- Username save ---
  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setEditingUsername(false);
      return;
    }
    setSavingUsername(true);
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${API}/api/users/${user?.id}`,
        { username: newUsername.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser({ username: newUsername.trim() });
      setEditingUsername(false);
      toast.success(t("toast.usernameSaved"));
    } catch {
      toast.error(t("toast.usernameSaveFailed"));
    } finally {
      setSavingUsername(false);
    }
  };

  // --- Address CRUD ---
  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${API}/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter((a) => a.id !== addressId));
      toast.success(t("toast.addressDeleted"));
    } catch {
      toast.error(t("toast.addressDeleteFailed"));
    }
  };

  const openAddModal = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowAddressModal(true);
  };

  const openEditModal = (addr: any) => {
    setAddressForm({
      type: addr.type || "Home",
      recipient_name: addr.recipient_name || addr.recipientName || "",
      phone_num: addr.phone_num || addr.phoneNumber || "",
      full_address: addr.full_address || addr.fullAddress || "",
    });
    setEditingAddressId(addr.id);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    const token = localStorage.getItem("jwt");

    try {
      if (editingAddressId) {
        // Update
        const res = await axios.put(
          `${API}/api/addresses/${editingAddressId}`,
          { data: addressForm },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(
          addresses.map((a) => (a.id === editingAddressId ? res.data.data : a))
        );
      } else {
        // Create
        const res = await axios.post(
          `${API}/api/addresses`,
          { data: { ...addressForm, user: user?.id } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses([...addresses, res.data.data]);
      }
      setShowAddressModal(false);
      toast.success(t("toast.addressSaved"));
    } catch {
      toast.error(t("toast.addressSaveFailed"));
    } finally {
      setSavingAddress(false);
    }
  };

  // --- Image upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("toast.selectImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("toast.imageSize"));
      return;
    }

    setUploadingImage(true);
    const token = localStorage.getItem("jwt");

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(`${API}/api/profile-image`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const imgUrl = res.data.url.startsWith("http")
        ? res.data.url
        : `${API}${res.data.url}`;
      updateUser({ profileImage: imgUrl });
      toast.success(t("toast.profileImageUpdated"));
    } catch {
      toast.error(t("toast.profileImageFailed"));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  // --- SUB-COMPONENT: INFO ---
  const InfoTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-teak-dark mb-6 border-b border-cream-alt pb-2">{t("profile.personalInfo")}</h2>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 bg-cream border border-cream-alt rounded-lg">
        <div className="relative group flex-shrink-0">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.username} className="w-28 h-28 rounded-full object-cover border-[3px] border-gold" />
          ) : (
            <div className="w-28 h-28 bg-gold rounded-full flex items-center justify-center text-teak-dark text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all cursor-pointer"
          >
            {uploadingImage ? (
              <Loader2 size={28} className="text-white animate-spin" />
            ) : (
              <Camera size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-teak-dark">{user.username}</h3>
          <p className="text-text-muted">{user.email}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-gold text-teak-dark rounded-lg text-sm font-bold hover:bg-gold-hover transition-colors"
          >
            {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {uploadingImage ? t("profile.uploading") : t("profile.changePhoto")}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Username - editable */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-teak-dark flex items-center gap-2">
            <User size={20} className="text-gold" /> {t("profile.username")}
          </label>
          {editingUsername ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="flex-1 p-4 bg-white border-2 border-gold rounded text-xl text-text-main outline-none focus:ring-1 focus:ring-gold"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveUsername();
                  if (e.key === "Escape") setEditingUsername(false);
                }}
              />
              <button
                onClick={handleSaveUsername}
                disabled={savingUsername}
                className="px-4 py-2 bg-teak text-cream rounded font-bold hover:bg-teak-dark transition-colors flex items-center gap-1"
              >
                {savingUsername ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {t("profile.saveUsername")}
              </button>
              <button
                onClick={() => setEditingUsername(false)}
                className="px-4 py-2 border border-cream-alt rounded text-text-muted hover:bg-cream transition-colors"
              >
                {t("profile.cancelEdit")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 bg-cream border border-cream-alt rounded text-xl text-text-main">{user.username}</div>
              <button
                onClick={() => {
                  setNewUsername(user.username);
                  setEditingUsername(true);
                }}
                className="p-3 bg-gold/10 hover:bg-gold/20 rounded-lg text-teak transition-colors"
                title={t("profile.editUsername")}
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Email - read only */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-teak-dark flex items-center gap-2">
            <Mail size={20} className="text-gold" /> {t("profile.email")}
          </label>
          <div className="p-4 bg-cream border border-cream-alt rounded text-xl text-text-main">{user.email}</div>
        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: ORDERS ---
  const OrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-teak-dark border-b border-cream-alt pb-4">{t("profile.orderHistory")}</h2>
      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gold" /></div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="bg-cream border border-cream-alt rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div>
                <span className="font-bold text-lg text-teak-dark">{order.orderNumber || `Order #${order.id}`}</span>
                <p className="text-sm text-text-muted flex items-center gap-1">
                  <Calendar size={14}/> {new Date(order.orderDate || order.createdAt).toLocaleDateString("th-TH")}
                </p>
              </div>
              <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 w-fit mt-2 md:mt-0 ${
                order.status === "delivered" ? "bg-green-100 text-green-700" :
                order.status === "cancelled" ? "bg-red-100 text-red-700" :
                order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                order.status === "paid" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {order.status === "delivered" ? <CheckCircle size={16}/> : <Clock size={16}/>}
                <span className="capitalize">{order.status || "pending"}</span>
              </div>
            </div>
            <div className="border-t border-cream-alt pt-4">
              <div className="text-sm text-text-muted mb-2">
                <p>{order.recipientName} &middot; {order.phone}</p>
                <p className="text-text-muted">{order.paymentMethod === "promptpay" ? "PromptPay" : "Bank Transfer"}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-sm">Total:</p>
                <p className="text-2xl font-serif font-bold text-price">
                  ฿{(order.totalAmount ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-text-muted">{t("profile.noOrders")}</div>
      )}
    </div>
  );

  // --- SUB-COMPONENT: ADDRESSES ---
  const AddressesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-cream-alt pb-4">
        <h2 className="text-2xl font-serif text-teak-dark">{t("profile.myAddresses")}</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gold text-teak-dark px-4 py-2 rounded font-bold hover:bg-gold-hover text-sm transition-colors"
        >
          <Plus size={18} /> {t("profile.addNew")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gold" /></div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-cream border border-cream-alt rounded-lg p-6 relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(addr)}
                  className="p-2 bg-card rounded shadow hover:text-gold text-text-muted transition-colors"
                >
                  <Edit2 size={16}/>
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 bg-card rounded shadow hover:text-red-600 text-text-muted transition-colors"
                >
                  <Trash2 size={16}/>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teak-dark text-gold text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {addr.type || "Home"}
                </span>
                <h3 className="font-bold text-lg text-teak-dark">{addr.recipient_name || addr.recipientName || "—"}</h3>
              </div>

              <p className="text-text-muted mb-1 flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-gold" />
                {addr.full_address || addr.fullAddress || "—"}
              </p>
              <p className="text-text-muted flex items-center gap-2 ml-7">
                <span className="font-bold text-text-muted">Tel:</span> {addr.phone_num || addr.phoneNumber || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-text-muted">{t("profile.noAddresses")}</div>
      )}
    </div>
  );

  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left border-b-2 border-gold pb-6">
          <h1 className="text-4xl font-serif text-teak-dark font-bold">{t("profile.title")}</h1>
          <p className="text-xl text-text-muted mt-2">{t("profile.welcome")}, {user.username}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden border-t-4 border-teak-dark">
              <div className="p-6 bg-teak-dark text-cream text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 group">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} className="w-24 h-24 rounded-full object-cover border-[3px] border-gold" />
                  ) : (
                    <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-teak-dark text-3xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all cursor-pointer"
                  >
                    {uploadingImage ? (
                      <Loader2 size={24} className="text-white animate-spin" />
                    ) : (
                      <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-xs text-gold/70 mt-1">{t("profile.clickToChange")}</p>
              </div>
              <nav className="flex flex-col">
                <button onClick={() => setActiveTab("info")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-cream-alt ${activeTab === "info" ? "bg-cream border-l-4 border-l-gold text-teak-dark font-bold" : "text-text-muted hover:bg-cream"}`}>
                  <User size={20} /> {t("profile.personalInfo")}
                </button>
                <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-cream-alt ${activeTab === "orders" ? "bg-cream border-l-4 border-l-gold text-teak-dark font-bold" : "text-text-muted hover:bg-cream"}`}>
                  <Package size={20} /> {t("profile.orders")}
                </button>
                <button onClick={() => setActiveTab("addresses")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-cream-alt ${activeTab === "addresses" ? "bg-cream border-l-4 border-l-gold text-teak-dark font-bold" : "text-text-muted hover:bg-cream"}`}>
                  <MapPin size={20} /> {t("profile.addresses")}
                </button>
                <button onClick={logout} className="flex items-center gap-3 px-6 py-4 text-red-600 text-lg font-medium hover:bg-red-50 transition-colors">
                  <LogOut size={20} /> {t("nav.logout")}
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg shadow-lg p-8 border-t-4 border-gold min-h-[500px]">
              {activeTab === "info" && <InfoTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddressModal(false)}>
          <div className="bg-[#FDF8F0] rounded-xl shadow-2xl w-full max-w-lg border-t-4 border-gold" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-cream-alt">
              <h3 className="text-xl font-serif font-bold text-teak-dark">
                {editingAddressId ? t("profile.editAddress") : t("profile.addAddress")}
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-cream rounded transition-colors">
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="text-sm font-bold text-teak-dark mb-1 block">{t("profile.addressType")}</label>
                <div className="flex gap-2">
                  {["Home", "Office", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, type })}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        addressForm.type === type
                          ? "bg-teak-dark text-gold"
                          : "bg-cream border border-cream-alt text-text-muted hover:border-gold"
                      }`}
                    >
                      {t(`profile.${type.toLowerCase()}` as any)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-sm font-bold text-teak-dark mb-1 block">{t("profile.recipientName")} ({t("profile.firstAndSurname")})</label>
                <input
                  type="text"
                  required
                  value={addressForm.recipient_name}
                  onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                  className="w-full py-3 px-4 border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-bold text-teak-dark mb-1 block">{t("profile.phoneNumber")}</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone_num}
                  onChange={(e) => setAddressForm({ ...addressForm, phone_num: e.target.value.replace(/\D/g, "") })}
                  placeholder="0812345678"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full py-3 px-4 border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                />
              </div>

              {/* Postal Code Lookup */}
              <PostalCodeLookup
                onAddressFill={(autoAddress) => {
                  setAddressForm((prev) => ({
                    ...prev,
                    full_address: prev.full_address
                      ? prev.full_address.split("\n")[0] + "\n" + autoAddress
                      : autoAddress,
                  }));
                }}
              />

              {/* Full Address */}
              <div>
                <label className="text-sm font-bold text-teak-dark mb-1 block">{t("profile.fullAddress")}</label>
                <textarea
                  required
                  rows={3}
                  value={addressForm.full_address}
                  onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })}
                  placeholder={t("checkout.addressPlaceholder")}
                  className="w-full py-3 px-4 border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="flex-1 bg-teak text-cream py-3 rounded-lg font-bold hover:bg-teak-dark transition-colors flex items-center justify-center gap-2"
                >
                  {savingAddress ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {savingAddress ? t("profile.uploading") : (editingAddressId ? t("profile.saveUsername") : t("profile.addAddress"))}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-6 py-3 border border-cream-alt rounded-lg text-text-muted hover:bg-cream transition-colors font-bold"
                >
                  {t("profile.cancelEdit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
