"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t } = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
        { identifier: email, password }
      );
      const { jwt, user: userData } = response.data;

      // Fetch role + profile image
      try {
        const meRes = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me?populate=role`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        userData.role = meRes.data.role || null;
        userData.profileImage = meRes.data.profileImage || null;
      } catch {
        userData.role = null;
      }

      login(userData, jwt);
      window.location.href = "/";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const strapiError = err.response?.data?.error?.message;
        if (strapiError === "Invalid identifier or password") {
          setError(t("login.invalidCredentials"));
        } else if (strapiError === "Your account email is not confirmed") {
          setError(t("login.notConfirmed"));
        } else {
          setError(strapiError || t("login.failed"));
        }
      } else {
        setError(t("login.failedConnection"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-cream p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-teak-dark z-0" />

      <div className="relative z-10 w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-h3 font-serif text-teak-dark mb-2 font-bold">{t("login.title")}</h1>
          <p className="text-body text-text-muted">{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <div className="p-8 pt-2">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Email confirmed success banner */}
            {confirmed && !error && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-center gap-3 rounded-r-lg">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <p className="text-green-700 font-medium text-body">{t("login.confirmed")}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-[#9B1B1B] p-4 flex items-center gap-3 rounded-r-lg">
                <AlertCircle className="text-[#9B1B1B] flex-shrink-0" />
                <p className="text-[#9B1B1B] font-medium text-body">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-body font-bold text-teak-dark">{t("login.email")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold">
                  <User size={22} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-body font-bold text-teak-dark">{t("login.password")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold">
                  <Lock size={22} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-teak-dark p-2"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`relative overflow-hidden mt-2 w-full text-white text-body-lg font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[56px] ${
                isLoading ? "bg-text-muted cursor-not-allowed" : "hover:shadow-xl"
              }`}
              onMouseMove={(e) => {
                if (isLoading) return;
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--gx", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--gy", `${e.clientY - rect.top}px`);
              }}
              style={{ "--gx": "50%", "--gy": "50%", backgroundColor: isLoading ? undefined : "#482a1d" } as React.CSSProperties}
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(120px circle at var(--gx) var(--gy), rgba(255,255,255,0.15), transparent 70%)" }} />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? t("login.submitting") : <>{t("login.submit")} <ArrowRight size={22} /></>}
              </span>
            </button>
          </form>
        </div>

        <div className="bg-cream p-6 text-center border-t border-cream-alt">
          <p className="text-body text-text-muted mb-3">{t("login.noAccount")}</p>
          <Link
            href="/register"
            className="relative overflow-hidden inline-block text-white text-body font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all active:scale-95"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--gx", `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty("--gy", `${e.clientY - rect.top}px`);
              e.currentTarget.style.setProperty("--go", "1");
            }}
            onMouseLeave={(e) => { e.currentTarget.style.setProperty("--go", "0"); }}
            style={{ "--gx": "50%", "--gy": "50%", "--go": "0", backgroundColor: "#321c13" } as React.CSSProperties}
          >
            <span className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: "radial-gradient(120px circle at var(--gx) var(--gy), rgba(255,255,255,0.18), transparent 70%)", opacity: "var(--go)" }} />
            <span className="relative z-10">{t("login.createAccount")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
