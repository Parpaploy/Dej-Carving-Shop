"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

export default function RegisterClient() {
  const { t } = useLocale();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError(t("register.passwordTooShort"));
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        { username, email, password }
      );
      setRegistered(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const strapiError = err.response?.data?.error?.message;
        if (strapiError === "Email or Username are already taken") {
          setError(t("register.emailTaken"));
        } else {
          setError(strapiError || t("register.failed"));
        }
      } else {
        setError(t("register.failedConnection"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen — check your email
  if (registered) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-cream p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-teak-dark z-0" />

        <div className="relative z-10 w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={36} className="text-green-600" />
            </div>
            <h1 className="text-h3 font-serif text-teak-dark mb-3 font-bold">
              {t("register.success")}
            </h1>
            <p className="text-body text-text-muted mb-4 leading-relaxed">
              {t("register.checkEmail")}
            </p>
            <p className="text-sm text-text-muted/70 mb-8">
              {t("register.checkSpam")}
            </p>
            <Link
              href="/login"
              className="inline-block bg-teak hover:bg-teak-dark text-cream text-body font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {t("register.goToLogin")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-cream p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-teak-dark z-0" />

      <div className="relative z-10 w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
        <div className="p-8 pb-2 text-center">
          <h1 className="text-h3 font-serif text-teak-dark mb-2 font-bold">{t("register.title")}</h1>
          <p className="text-body text-text-muted">{t("register.subtitle")}</p>
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
              <label htmlFor="fullname" className="text-body font-bold text-teak-dark">{t("register.fullName")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><User size={22} /></div>
                <input id="fullname" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("register.fullNamePlaceholder")} className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-body font-bold text-teak-dark">{t("register.email")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><Mail size={22} /></div>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-body font-bold text-teak-dark">{t("register.password")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><Lock size={22} /></div>
                <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("register.passwordPlaceholder")} className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-teak-dark p-2" aria-label="Toggle password">
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-body font-bold text-teak-dark">{t("register.confirmPassword")}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-gold"><CheckCircle size={22} /></div>
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("register.confirmPlaceholder")} className="w-full pl-12 pr-14 py-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-text-main bg-cream" />
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
              {isLoading ? t("register.submitting") : t("register.submit")}
            </button>
          </form>
        </div>

        <div className="bg-cream p-6 text-center border-t border-cream-alt">
          <p className="text-body text-text-muted mb-2">{t("register.hasAccount")}</p>
          <Link href="/login" className="text-body-lg font-bold text-teak border-b-2 border-teak hover:text-gold hover:border-gold transition-colors">
            {t("register.login")}
          </Link>
        </div>
      </div>
    </main>
  );
}
