"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Mail, Calendar, MapPin, Package, LogOut, Plus, Edit2, Trash2, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function ProfileClient() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "addresses">("info");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !localStorage.getItem("user")) {
      router.push("/login");
      return;
    }

    // Fetch Real Data
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // A. Fetch Orders (Filter by current user)
        // Strapi automatically filters for the user if you used the 'owner' policy, 
        // but explicit filtering is safer: filters[user][id][$eq]=USER_ID
        const ordersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders?filters[user][id][$eq]=${user?.id}&sort=createdAt:desc`, 
          config
        );

        // B. Fetch Addresses
        const addressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/addresses?filters[user][id][$eq]=${user?.id}`,
          config
        );

        setOrders(ordersRes.data.data);
        setAddresses(addressRes.data.data);

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();

  }, [user, router]);

  // 2. Delete Address Function
  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update UI immediately
      setAddresses(addresses.filter(a => a.id !== addressId));
      toast.success("Address deleted.");
    } catch (err) {
      toast.error("Failed to delete address.");
    }
  };

  if (!user) return null;

  // --- SUB-COMPONENT: ORDERS ---
  const OrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-[#4B3621] border-b border-gray-200 pb-4">My Order History</h2>
      
      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div>
                <span className="font-bold text-lg text-[#2e1d10]">Order #{order.id}</span>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14}/> {new Date(order.attributes.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 w-fit mt-2 md:mt-0 ${
                order.attributes.status === "delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {order.attributes.status === "delivered" ? <CheckCircle size={16}/> : <Clock size={16}/>}
                <span className="capitalize">{order.attributes.status}</span>
              </div>
            </div>
            
            {/* Order Items Snapshot */}
            <div className="border-t border-gray-200 pt-4">
               <div className="text-sm text-gray-600 mb-2">
                 {/* Assuming order_items is stored as simple JSON text or object */}
                 {/* Example: "Teak Chair x 1" */}
                 {JSON.stringify(order.attributes.order_items)} 
               </div>
               <div className="text-right">
                <p className="text-gray-600 text-sm">Total:</p>
                <p className="text-2xl font-serif font-bold text-[#8B0000]">
                  ฿{order.attributes.total_amount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">No orders found.</div>
      )}
    </div>
  );

  // --- SUB-COMPONENT: ADDRESSES ---
  const AddressesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-serif text-[#4B3621]">My Addresses</h2>
        <button 
          onClick={() => toast.info("Create Address Feature Coming Next!")} // Hook this up to a modal later
          className="flex items-center gap-2 bg-[#D4AF37] text-[#2e1d10] px-4 py-2 rounded font-bold hover:bg-[#b5952f] text-sm"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-6 relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 bg-white rounded shadow hover:text-red-600 text-gray-400"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#2e1d10] text-[#D4AF37] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {addr.attributes.type}
                </span>
                <h3 className="font-bold text-lg text-[#2e1d10]">{addr.attributes.recipient_name}</h3>
              </div>
              
              <p className="text-gray-600 mb-1 flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-[#D4AF37]" /> 
                {addr.attributes.full_address}
              </p>
              <p className="text-gray-600 flex items-center gap-2 ml-7">
                <span className="font-bold text-gray-400">Tel:</span> {addr.attributes.phone_number}
              </p>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-10 text-gray-500">No addresses saved yet.</div>
      )}
    </div>
  );

  // --- SUB-COMPONENT: INFO ---
  const InfoTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-[#4B3621] mb-6 border-b border-gray-200 pb-2">Personal Information</h2>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-[#2e1d10] flex items-center gap-2">
            <User size={20} className="text-[#D4AF37]" /> Username
          </label>
          <div className="p-4 bg-[#FAF9F6] border border-gray-300 rounded text-xl text-gray-700">{user.username}</div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-[#2e1d10] flex items-center gap-2">
            <Mail size={20} className="text-[#D4AF37]" /> Email
          </label>
          <div className="p-4 bg-[#FAF9F6] border border-gray-300 rounded text-xl text-gray-700">{user.email}</div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left border-b-2 border-[#D4AF37] pb-6">
          <h1 className="text-4xl font-serif text-[#4B3621] font-bold">My Account</h1>
          <p className="text-xl text-gray-600 mt-2">Welcome back, {user.username}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#2e1d10]">
              <div className="p-6 bg-[#2e1d10] text-[#FAF9F6] text-center">
                <div className="w-20 h-20 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center text-[#2e1d10] text-3xl font-bold mb-3">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold">{user.username}</h3>
              </div>
              <nav className="flex flex-col">
                <button onClick={() => setActiveTab("info")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-gray-100 ${activeTab === "info" ? "bg-[#FAF9F6] border-l-4 border-l-[#D4AF37] text-[#4B3621] font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                  <User size={20} /> Personal Info
                </button>
                <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-gray-100 ${activeTab === "orders" ? "bg-[#FAF9F6] border-l-4 border-l-[#D4AF37] text-[#4B3621] font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                  <Package size={20} /> My Orders
                </button>
                <button onClick={() => setActiveTab("addresses")} className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-colors border-b border-gray-100 ${activeTab === "addresses" ? "bg-[#FAF9F6] border-l-4 border-l-[#D4AF37] text-[#4B3621] font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                  <MapPin size={20} /> Addresses
                </button>
                <button onClick={logout} className="flex items-center gap-3 px-6 py-4 text-red-600 text-lg font-medium hover:bg-red-50 transition-colors">
                  <LogOut size={20} /> Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#D4AF37] min-h-[500px]">
              {activeTab === "info" && <InfoTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}