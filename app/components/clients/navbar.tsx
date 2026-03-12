"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Phone, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";
import { ICategory } from "@/app/interfaces/category.interface";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const categoryRef = React.useRef<HTMLDivElement>(null);
  const categoryTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/categories?sort=name:asc`
        );
        const json = await res.json();
        setCategories(json.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Click outside — user menu
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
   <header className="w-full z-[100] sticky top-0 shadow-md border-b border-gold/10 transition-all duration-300" style={{ backgroundColor: '#482a1d' }}>
      <nav className="text-cream px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

         {/* LOGO & BRAND */}
          <Link
            href="/"
            className="flex items-center gap-3 font-sans text-2xl md:text-3xl tracking-wide text-cream hover:text-gold-soft transition-colors drop-shadow-sm group font-semibold"
          >
            {/* Logo Placeholder */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-gold-soft/40 group-hover:border-gold-soft transition-colors shadow-sm bg-teak/50 flex items-center justify-center">
              {/* HOW TO USE YOUR REAL LOGO:
                1. Put your logo image (e.g., 'logo.png') inside the 'public' folder of your Next.js project.
                2. Change the src below to src="/logo.png"
              */}
              <img
                src="https://placehold.co/100x100/482a1d/ddd9d0?text=Logo"
                alt="Dej Carving Shop Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Shop Name */}
            <span>{t("common.shopName")}</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">{t("nav.home")}</NavLink>

            {/* Products with category dropdown */}
            <div
              ref={categoryRef}
              className="relative"
              onMouseEnter={() => {
                if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
                setIsCategoryOpen(true);
              }}
              onMouseLeave={() => {
                categoryTimeoutRef.current = setTimeout(() => {
                  setIsCategoryOpen(false);
                }, 150);
              }}
            >
              <Link
                href="/products"
                className="relative group text-body-lg font-medium text-cream/90 hover:text-white transition-colors pb-1 flex items-center gap-1"
              >
                {t("nav.products")}
                {categories.length > 0 && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                )}
                <span className="absolute left-0 bottom-1 w-full h-[2px] bg-gold-soft scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out rounded-full" />
              </Link>

              <AnimatePresence>
                {isCategoryOpen && categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 mt-3 w-56 bg-white text-teak-dark rounded-xl shadow-2xl py-2 border border-cream-alt z-[100] overflow-hidden"
                  >
                    <Link
                      href="/products"
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-cream text-body font-medium transition-colors border-b border-cream-alt"
                    >
                      {t("nav.allProducts")}
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cream text-body transition-colors"
                      >
                        {cat.icon && <span className="text-lg">{cat.icon}</span>}
                        <span className="font-medium">
                          {t(cat.nameKey as any) || cat.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/about">{t("nav.about")}</NavLink>
            <NavLink href="/contact">{t("nav.contact")}</NavLink>
          </div>

          {/* DESKTOP UTILITIES */}
          <div className="hidden md:flex items-center gap-6">


            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 hover:text-gold-soft transition-colors focus:outline-none group"
                >
                  <div className="relative">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-gold-soft transition-all duration-300 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gold/90 rounded-full flex items-center justify-center text-teak font-bold text-lg shadow-sm group-hover:bg-gold transition-colors">
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-body font-medium max-w-[120px] truncate text-cream/90">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                   <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 mt-3 w-52 bg-white text-teak-dark rounded-xl shadow-2xl py-2 border border-cream-alt z-[100] overflow-hidden"
                   >
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cream text-body font-medium transition-colors"
                      >
                        <Settings size={18} className="text-text-muted" /> {t("nav.profile")}
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-body font-medium text-left border-t border-cream-alt transition-colors"
                      >
                        <LogOut size={18} /> {t("nav.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-cream/90 hover:text-gold-soft transition-colors"
              >
                <User size={20} />
                <span className="text-body font-medium">{t("nav.login")}</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-gold text-cream/90 px-5 py-2.5 rounded-full hover:bg-gold-soft hover:text-white hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 transition-all duration-300 relative font-semibold"
            >
              <ShoppingCart size={20} />
              <span className="text-body">{t("nav.cart")}</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-teak shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* MOBILE: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative p-2" aria-label="Shopping cart">
              <ShoppingCart size={24} className="text-cream" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-teak">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="text-cream p-1 hover:text-gold-soft transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
              className="md:hidden mt-4 pb-4 border-t border-cream/10 overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-4">
                <MobileLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.home")}
                </MobileLink>

                {/* Products with expandable categories */}
                <div>
                  <div className="flex items-center mx-2">
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-grow text-lg py-3 px-4 text-cream/90 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                    >
                      {t("nav.products")}
                    </Link>
                    {categories.length > 0 && (
                      <button
                        onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                        className="p-3 text-cream/70 hover:text-white transition-colors"
                        aria-label="Toggle categories"
                      >
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 ${isMobileCategoryOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isMobileCategoryOpen && categories.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pb-2 space-y-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileCategoryOpen(false);
                              }}
                              className="flex items-center gap-3 text-base py-2 px-4 text-cream/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                            >
                              {cat.icon && <span>{cat.icon}</span>}
                              <span>{t(cat.nameKey as any) || cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <MobileLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.about")}
                </MobileLink>
                <MobileLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.contact")}
                </MobileLink>

                <div className="h-px bg-cream/10 my-3 mx-4" />

                {/* Phone */}
                <a
                  href="tel:092-3640013"
                  className="flex items-center gap-3 text-lg py-3 px-4 text-gold-soft hover:bg-white/5 rounded-xl mx-2 transition-colors"
                >
                  <Phone size={20} /> {t("common.phone")}
                </a>

                <div className="h-px bg-cream/10 my-3 mx-4" />

                {user ? (
                  <>
                    <MobileLink href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3">
                        <User size={20} />
                        {t("nav.profile")} <span className="text-sm opacity-70">({user.username})</span>
                      </div>
                    </MobileLink>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-3 text-lg py-3 px-4 text-red-400 text-left hover:bg-white/5 rounded-xl mx-2 w-[calc(100%-1rem)] transition-colors"
                    >
                      <LogOut size={20} /> {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <MobileLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3">
                      <User size={20} /> {t("nav.login")}
                    </div>
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
      className="relative group text-body-lg font-medium text-cream/90 hover:text-white transition-colors pb-1"
    >
      {children}
      <span className="absolute left-0 bottom-1 w-full h-[2px] bg-gold-soft scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out rounded-full" />
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg py-3 px-4 text-cream/90 hover:text-white hover:bg-white/5 rounded-xl block mx-2 transition-all duration-200"
    >
      {children}
    </Link>
  );
}
