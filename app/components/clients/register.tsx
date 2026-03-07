"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function RegisterClient() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัว / Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน / Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        { username, email, password }
      );
      const { jwt, user: userData } = response.data;
      login(userData, jwt);
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const strapiError = err.response?.data?.error?.message;
        if (strapiError === "Email or Username are already taken") {
          setError("อีเมลนี้มีผู้ใช้แล้ว / This email is already registered.");
        } else {
          setError(strapiError || "สมัครไม่สำเร็จ / Registration failed.");
        }
      } else {
        setError("สมัครไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-cream p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-teak-dark z-0" />

      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
        <div className="p-8 pb-2 text-center">
          <h1 className="text-h3 font-serif text-teak-dark mb-2 font-bold">สมัครสมาชิก</h1>
          <p className="text-body text-text-muted">Create Account — เริ่มสะสมไม้สักกับเรา</p>
        </div>

        <div className="p-8 pt-4">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-[#9B1B1B] p-4 flex items-center gap-3 rounded-r-lg">
                <AlertCircle className="text-[#9B1B1B] flex-shrink-0" />
                <p className="text-[#9B1B1B] font-medium text-body">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="fullname" className="text-body font-bold text-teak-dark">ชื่อ-สกุล / Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><User size={22} /></div>
                <input id="fullname" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น สมชาย ใจดี" className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-body font-bold text-teak-dark">อีเมล / Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><Mail size={22} /></div>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-body font-bold text-teak-dark">สร้างรหัสผ่าน / Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><Lock size={22} /></div>
                <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-teak-dark p-2" aria-label="Toggle password">
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-body font-bold text-teak-dark">ยืนยันรหัสผ่าน / Confirm</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><CheckCircle size={22} /></div>
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="กรอกรหัสผ่านอีกครั้ง" className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-teak-dark p-2" aria-label="Toggle confirm">
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full text-body-lg font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95 min-h-[56px] ${
                isLoading ? "bg-text-muted text-cream cursor-not-allowed" : "bg-gold hover:bg-gold-hover text-cream"
              }`}
            >
              {isLoading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก / Create Account"}
            </button>
          </form>
        </div>

        <div className="bg-cream p-6 text-center border-t border-cream-alt">
          <p className="text-body text-text-muted mb-2">มีบัญชีอยู่แล้ว? / Already a member?</p>
          <Link href="/login" className="text-body-lg font-bold text-teak border-b-2 border-teak hover:text-gold hover:border-gold transition-colors">
            เข้าสู่ระบบ / Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
