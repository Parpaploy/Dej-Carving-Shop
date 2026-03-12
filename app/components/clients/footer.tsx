"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Clock, MapPin, Send, CreditCard, Banknote, QrCode, ChevronRight } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative overflow-hidden">

      {/* Newsletter Section — teak band */}
      <div className="relative bg-gradient-to-br from-teak-dark via-teak to-teak-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h4 className="text-2xl font-bold text-white mb-2">
                {t("footer.newsletter")}
              </h4>
              <p className="text-cream/50 text-sm max-w-sm">
                {t("footer.newsletterSub")}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 text-gold-soft font-semibold py-3 px-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t("footer.subscribed")}
                </div>
              ) : (
                <div className="flex w-full rounded-full overflow-hidden border border-cream/15 bg-white/5 backdrop-blur-sm focus-within:border-gold-soft/40 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("footer.emailPlaceholder")}
                    required
                    className="flex-grow bg-transparent px-6 py-3.5 text-cream placeholder:text-cream/30 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-soft text-teak-dark font-bold px-6 py-3.5 transition-all duration-300 flex items-center gap-2 hover:gap-3"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline text-sm">{t("footer.subscribe")}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer — white pearl */}
      <div className="bg-[#f5f3ef]">
        {/* Subtle accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-cream-alt to-transparent" />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">

            {/* Column 1: Brand */}
            <div className="lg:col-span-4 pr-0 lg:pr-6">
              <h3 className="font-sans text-2xl font-bold text-teak-dark mb-4">
                {t("common.shopName")}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {t("common.shopTagline")}
              </p>

              {/* Payment Methods */}
              <div className="pt-4 border-t border-cream-alt">
                <p className="text-text-muted/60 text-xs uppercase tracking-widest mb-3">{t("footer.payment")}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-cream border border-cream-alt rounded-lg px-3 py-2 text-text-muted hover:text-teak hover:border-teak/20 transition-all" title="Bank Transfer">
                    <Banknote size={15} />
                    <span className="text-xs">Bank</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-cream border border-cream-alt rounded-lg px-3 py-2 text-text-muted hover:text-teak hover:border-teak/20 transition-all" title="PromptPay">
                    <QrCode size={15} />
                    <span className="text-xs">PromptPay</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-cream border border-cream-alt rounded-lg px-3 py-2 text-text-muted hover:text-teak hover:border-teak/20 transition-all" title="Credit/Debit Card">
                    <CreditCard size={15} />
                    <span className="text-xs">Card</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-text-muted/60 mb-5 uppercase tracking-[0.2em]">
                {t("footer.menu")}
              </h4>
              <nav className="flex flex-col gap-1">
                <FooterLink href="/">{t("nav.home")}</FooterLink>
                <FooterLink href="/products">{t("nav.products")}</FooterLink>
                <FooterLink href="/about">{t("nav.about")}</FooterLink>
                <FooterLink href="/contact">{t("nav.contact")}</FooterLink>
              </nav>
            </div>

            {/* Column 3: Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-text-muted/60 mb-5 uppercase tracking-[0.2em]">
                {t("footer.contactUs")}
              </h4>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="tel:092-3640013"
                  className="flex items-center gap-3 text-text-muted hover:text-teak transition-all duration-300 group py-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-cream-alt/60 flex items-center justify-center group-hover:bg-teak/10 transition-colors flex-shrink-0">
                    <Phone size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span>{t("common.phone")}</span>
                </a>
                <a
                  href={`mailto:${t("common.email")}`}
                  className="flex items-center gap-3 text-text-muted hover:text-teak transition-all duration-300 group py-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-cream-alt/60 flex items-center justify-center group-hover:bg-teak/10 transition-colors flex-shrink-0">
                    <Mail size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs break-all leading-relaxed">{t("common.email")}</span>
                </a>
                <div className="flex items-center gap-3 text-text-muted py-1">
                  <div className="w-8 h-8 rounded-lg bg-cream-alt/60 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span>{t("common.banTawai")}</span>
                </div>
                <div className="flex items-center gap-3 text-text-muted py-1">
                  <div className="w-8 h-8 rounded-lg bg-cream-alt/60 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} />
                  </div>
                  <span>{t("common.openHours")}</span>
                </div>
              </div>
            </div>

            {/* Column 4: Map */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-text-muted/60 mb-5 uppercase tracking-[0.2em]">
                {t("footer.location") || "Location"}
              </h4>
              <div className="rounded-xl overflow-hidden border border-cream-alt shadow-lg group relative h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1889.7124041400114!2d98.9449374385011!3d18.689789995609264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3114739e5ed7%3A0x80588edbe66d9927!2sDej%20Carving%20Shop!5e0!3m2!1sth!2sth!4v1768209226485!5m2!1sth!2sth"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dej Carving Shop location"
                  className="opacity-80 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream-alt">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-text-muted/50 text-xs">
              © {new Date().getFullYear()} {t("common.shopName")}. {t("footer.copyright")}
            </p>
            <div className="flex gap-6 text-text-muted/50 text-xs">
              <Link href="/privacy" className="hover:text-teak transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-teak transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-text-muted hover:text-teak transition-all duration-300 flex items-center gap-0 group w-fit py-1.5 text-sm"
    >
      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-teak" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {children}
      </span>
    </Link>
  );
}
