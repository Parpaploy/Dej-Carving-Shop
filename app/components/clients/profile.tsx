"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Package, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Loading from "./loading";

export default function ProfileClient() {
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!user) return <Loading />;

  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10 text-center md:text-left border-b-2 border-gold pb-6">
          <h1 className="text-h2 font-serif text-teak-dark font-bold">บัญชีของฉัน</h1>
          <p className="text-body text-text-muted mt-2">My Account — จัดการโปรไฟล์และดูคำสั่งซื้อ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* SIDEBAR */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-gold-soft/20">
              <div className="p-6 bg-teak text-cream text-center">
                <div className="w-20 h-20 bg-gold rounded-full mx-auto flex items-center justify-center text-cream text-3xl font-bold mb-3">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h3 className="text-h5 font-bold">{user.username}</h3>
                <p className="text-sm text-cream/70">สมาชิก / Member</p>
              </div>
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-4 bg-cream border-l-4 border-gold text-teak-dark font-bold text-body">
                  <User size={20} /> ข้อมูลส่วนตัว
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-cream text-text-muted text-body border-b border-cream-alt transition-colors">
                  <Package size={20} /> คำสั่งซื้อ
                </button>
                <button className="flex items-center gap-3 px-6 py-4 hover:bg-cream text-text-muted text-body transition-colors">
                  <MapPin size={20} /> ที่อยู่จัดส่ง
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-xl shadow-lg p-8 border-t-4 border-gold">
              <h2 className="text-h4 font-serif text-teak-dark mb-6 border-b border-cream-alt pb-2">
                ข้อมูลส่วนตัว / Personal Info
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-body font-bold text-teak-dark flex items-center gap-2">
                    <User size={20} className="text-gold" /> ชื่อ / Name
                  </label>
                  <div className="p-4 bg-cream border border-cream-alt rounded-lg text-body-lg text-text-main">
                    {user.username}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-body font-bold text-teak-dark flex items-center gap-2">
                    <Mail size={20} className="text-gold" /> อีเมล / Email
                  </label>
                  <div className="p-4 bg-cream border border-cream-alt rounded-lg text-body-lg text-text-main">
                    {user.email}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-body font-bold text-teak-dark flex items-center gap-2">
                    <Calendar size={20} className="text-gold" /> หมายเลขสมาชิก / Member ID
                  </label>
                  <div className="p-4 bg-cream border border-cream-alt rounded-lg text-body-lg text-text-main">
                    User #{user.id}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-cream-alt flex flex-col md:flex-row gap-4">
                <button className="bg-teak text-cream px-8 py-3 rounded-lg text-body font-bold hover:bg-teak-dark transition-colors shadow-md min-h-[48px]">
                  แก้ไขโปรไฟล์ / Edit Profile
                </button>
                <button className="border-2 border-price/30 text-price px-8 py-3 rounded-lg text-body font-bold hover:bg-red-50 transition-colors min-h-[48px]">
                  ลบบัญชี / Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
