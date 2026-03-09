"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Phone, User, LogOut, Settings } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";


export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <header className="w-full shadow-lg z-50 sticky top-0">
      <nav className="bg-teak text-cream px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="font-castoro text-2xl md:text-3xl tracking-wide text-cream hover:text-gold-soft transition-colors"
          >
            {t("common.shopName")}
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">{t("nav.home")}</NavLink>
            <NavLink href="/products">{t("nav.products")}</NavLink>
            <NavLink href="/about">{t("nav.about")}</NavLink>
            <NavLink href="/contact">{t("nav.contact")}</NavLink>
          </div>

          {/* DESKTOP UTILITIES */}
          <div className="hidden md:flex items-center gap-8">
            {/* Phone */}
            <a
              href="tel:092-3640013"
              className="flex items-center gap-2 text-cream/80 hover:text-gold-soft transition-colors"
            >
              <Phone size={20} />
              <span className="text-sm hidden lg:inline">{t("common.phone")}</span>
            </a>

            <div className="w-px h-8 bg-cream/30" />

            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:text-gold-soft transition-colors focus:outline-none"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-gold" />
                  ) : (
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-cream font-bold text-lg">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-body font-medium max-w-[120px] truncate">
                    {user.username}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-card text-text-main rounded-lg shadow-xl py-2 border border-gold-soft/40 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-cream text-body font-medium transition-colors"
                    >
                      <Settings size={20} /> {t("nav.profile")}
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-price text-body font-medium text-left border-t border-cream-alt"
                    >
                      <LogOut size={20} /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-gold-soft transition-colors"
              >
                <User size={24} />
                <span className="text-body font-medium">{t("nav.login")}</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-gold text-cream px-5 py-2.5 rounded-lg hover:bg-gold-hover transition-colors relative font-semibold"
            >
              <ShoppingCart size={22} />
              <span className="text-body">{t("nav.cart")}</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-price text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-teak shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* MOBILE: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-2" aria-label="Shopping cart">
              <ShoppingCart size={28} className="text-cream" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-price text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="text-cream p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-cream/20 overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-4">
                <MobileLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.home")}
                </MobileLink>
                <MobileLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.products")}
                </MobileLink>
                <MobileLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.about")}
                </MobileLink>
                <MobileLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.contact")}
                </MobileLink>

                <div className="h-px bg-cream/20 my-3" />

                {/* Phone */}
                <a
                  href="tel:092-3640013"
                  className="flex items-center gap-3 text-xl py-3 px-4 text-gold-soft hover:bg-cream/10 rounded-lg"
                >
                  <Phone size={22} /> {t("common.phone")}
                </a>

                <div className="h-px bg-cream/20 my-3" />

                {user ? (
                  <>
                    <MobileLink href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.profile")} ({user.username})
                    </MobileLink>
                    <button
                      onClick={handleLogoutClick}
                      className="text-xl py-3 px-4 text-red-400 text-left hover:bg-cream/10 rounded-lg w-full"
                    >
                      {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <MobileLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.login")}
                  </MobileLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-body-lg font-medium text-cream/90 hover:text-gold-soft hover:underline underline-offset-4 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-xl py-3 px-4 hover:bg-cream/10 rounded-lg block"
    >
      {children}
    </Link>
  );
}
