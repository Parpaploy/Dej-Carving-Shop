"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";

export default function LoginClient() {
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
      const { jwt, user } = response.data;
      login(user, jwt);
      window.location.href = "/";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const strapiError = err.response?.data?.error?.message;
        if (strapiError === "Invalid identifier or password") {
          setError(t("login.invalidCredentials"));
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
                  className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream"
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
                  className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream"
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
              className={`mt-2 w-full text-cream text-body-lg font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[56px] ${
                isLoading ? "bg-text-muted cursor-not-allowed" : "bg-teak hover:bg-teak-dark"
              }`}
            >
              {isLoading ? t("login.submitting") : <>{t("login.submit")} <ArrowRight size={22} /></>}
            </button>
          </form>
        </div>

        <div className="bg-cream p-6 text-center border-t border-cream-alt">
          <p className="text-body text-text-muted mb-3">{t("login.noAccount")}</p>
          <Link
            href="/register"
            className="inline-block border-2 border-teak text-teak text-body font-bold py-2 px-6 rounded-lg hover:bg-teak hover:text-cream transition-colors"
          >
            {t("login.createAccount")}
          </Link>
        </div>
      </div>
    </main>
  );
}
