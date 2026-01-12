"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react"; 
import Link from "next/link";
import { ShoppingCart, Menu, X, Phone, User, LogOut, Settings } from "lucide-react";
import { useCart } from "../../context/CartContext"; 
import { useAuth } from "../../context/AuthContext"; 

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false); 
    logout(); 
  };

  return (
    <header className="w-full shadow-md z-50 relative sticky top-0">
      
      {/* --- TOP BAR --- */}
      <div className="bg-[#D4AF37] text-[#2e1d10] py-2 px-6 text-sm md:text-base font-semibold text-center md:text-right">
        <span className="flex items-center justify-center md:justify-end gap-2">
          <Phone size={16} /> Need help? Call us: 08X-XXX-XXXX
        </span>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <nav className="bg-[#2e1d10] text-[#FAF9F6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ✅ LOGO WITH PATTAYA FONT */}
          <Link 
            href="/" 
            className="text-3xl md:text-4xl font-pattaya tracking-wide text-[#F5F5DC] hover:text-[#D4AF37] transition-colors"
          >
            Dej Carving Shop
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Shop Items</NavLink>
            <NavLink href="/about">Our Story</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* UTILITY ICONS */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* --- USER PROFILE SECTION --- */}
            {user ? (
              <div className="relative">
                {/* User Button */}
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors focus:outline-none"
                >
                  <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#2e1d10] font-bold text-lg">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-lg font-medium max-w-[150px] truncate">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white text-[#2e1d10] rounded-md shadow-xl py-2 border-t-4 border-[#D4AF37] animate-fade-in z-50">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-[#FAF9F6] text-lg font-medium"
                    >
                      <Settings size={20} /> My Profile
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-700 text-lg font-medium text-left border-t border-gray-100"
                    >
                      <LogOut size={20} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // IF NOT LOGGED IN
              <Link href="/login" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <User size={24} />
                <span className="text-lg font-medium">Log In</span>
              </Link>
            )}
            
            {/* Cart Button */}
            <Link href="/cart" className="flex items-center gap-2 bg-[#FAF9F6] text-[#2e1d10] px-4 py-2 rounded hover:bg-[#D4AF37] transition-colors relative">
              <ShoppingCart size={24} />
              <span className="text-lg font-bold">Cart</span>
              
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button 
            className="md:hidden text-[#FAF9F6]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 flex flex-col gap-4 text-center">
            <MobileLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileLink>
            <MobileLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop Items</MobileLink>
            <MobileLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</MobileLink>
            <MobileLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileLink>
            
            <div className="h-[1px] bg-gray-700 my-2"></div>
            
            {user ? (
               <>
                 <MobileLink href="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile ({user.username})</MobileLink>
                 <button onClick={handleLogoutClick} className="text-xl py-2 text-red-400 block w-full hover:bg-white/10 rounded">Log Out</button>
               </>
            ) : (
               <MobileLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</MobileLink>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

// Helpers
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-lg font-medium hover:text-[#D4AF37] hover:underline underline-offset-4 transition-all">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-xl py-2 hover:bg-white/10 rounded block">
      {children}
    </Link>
  );
}