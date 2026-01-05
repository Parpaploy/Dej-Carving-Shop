"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, MapPin, Package } from "lucide-react";

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in, if not redirect
    const storedUser = localStorage.getItem("user");
    const storedJwt = localStorage.getItem("jwt");

    if (!storedUser || !storedJwt) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null; // Prevent flash of content

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] py-12 px-4">
      
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-10 text-center md:text-left border-b-2 border-[#D4AF37] pb-6">
          <h1 className="text-4xl font-serif text-[#4B3621] font-bold">My Account</h1>
          <p className="text-xl text-gray-600 mt-2">Manage your profile and view your collections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- LEFT SIDEBAR (Menu) --- */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#2e1d10]">
              <div className="p-6 bg-[#2e1d10] text-[#FAF9F6] text-center">
                <div className="w-20 h-20 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center text-[#2e1d10] text-3xl font-bold mb-3">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-sm opacity-80">Collector since 2026</p>
              </div>
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-4 bg-[#FAF9F6] border-l-4 border-[#D4AF37] text-[#4B3621] font-bold text-lg">
                  <User size={20} /> Personal Info
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-600 text-lg border-b border-gray-100 transition-colors">
                  <Package size={20} /> My Orders
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-600 text-lg border-b border-gray-100 transition-colors">
                  <MapPin size={20} /> Addresses
                </button>
              </nav>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Details) --- */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#D4AF37]">
              <h2 className="text-2xl font-serif text-[#4B3621] mb-6 border-b border-gray-200 pb-2">
                Personal Information
              </h2>

              <div className="space-y-6">
                
                {/* Username Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold text-[#2e1d10] flex items-center gap-2">
                    <User size={20} className="text-[#D4AF37]" /> Full Name
                  </label>
                  <div className="p-4 bg-[#FAF9F6] border border-gray-300 rounded text-xl text-gray-700">
                    {user.username}
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold text-[#2e1d10] flex items-center gap-2">
                    <Mail size={20} className="text-[#D4AF37]" /> Email Address
                  </label>
                  <div className="p-4 bg-[#FAF9F6] border border-gray-300 rounded text-xl text-gray-700">
                    {user.email}
                  </div>
                </div>

                {/* Member Since Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold text-[#2e1d10] flex items-center gap-2">
                    <Calendar size={20} className="text-[#D4AF37]" /> Member ID
                  </label>
                  <div className="p-4 bg-[#FAF9F6] border border-gray-300 rounded text-xl text-gray-700">
                     User #{user.id}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row gap-4">
                <button className="bg-[#4B3621] text-white px-8 py-3 rounded text-lg font-bold hover:bg-[#2e1d10] transition-colors shadow-md">
                  Edit Profile
                </button>
                <button className="border-2 border-red-200 text-red-700 px-8 py-3 rounded text-lg font-bold hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}