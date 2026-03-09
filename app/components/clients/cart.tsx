"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useLocale } from "@/app/context/LocaleContext";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";

export default function CartClient() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t } = useLocale();

  if (cart.length === 0) {
    return (
      <main className="w-full min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-cream-alt p-8 rounded-full mb-6">
          <ShoppingBag size={64} className="text-text-muted" />
        </div>
        <h1 className="text-h2 font-serif text-teak-dark mb-4 font-bold">{t("cart.empty")}</h1>
        <p className="text-body text-text-muted mb-8 max-w-md">
          {t("cart.emptyMessage")}
        </p>
        <Link
          href="/products"
          className="bg-gold text-cream text-body-lg font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gold-hover transition-colors min-h-[56px]"
        >
          {t("cart.startShopping")}
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="p-2 hover:bg-cream-alt rounded-full transition-colors" aria-label="Back">
            <ArrowLeft size={32} className="text-teak-dark" />
          </Link>
          <div>
            <h1 className="text-h2 font-serif text-teak-dark font-bold">{t("cart.title")}</h1>
            <p className="text-body text-text-muted">{t("cart.subtitle")} — {cart.length} {t("common.items")}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* CART ITEMS */}
          <div className="flex-grow flex flex-col gap-5">
            {cart.map((item) => (
              <div key={item.id} className="bg-card p-5 rounded-xl shadow-md border border-gold-soft/20 flex flex-col sm:flex-row gap-5 items-center">

                <div className="w-36 h-36 flex-shrink-0 bg-cream-alt rounded-lg overflow-hidden border border-gold-soft/20">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-h5 font-serif text-teak-dark font-bold mb-2">{item.name}</h3>
                  <p className="text-h5 text-price font-bold">฿{item.price.toLocaleString()}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-cream rounded-lg p-2 border border-gold-soft/20">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-12 h-12 flex items-center justify-center bg-card rounded-lg shadow text-teak-dark hover:bg-gold hover:text-cream active:scale-95 transition-all"
                    aria-label={t("cart.decreaseQty")}
                  >
                    <Minus size={22} />
                  </button>
                  <span className="text-h4 font-bold w-10 text-center text-teak-dark">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-card rounded-lg shadow text-teak-dark hover:bg-gold hover:text-cream active:scale-95 transition-all"
                    aria-label={t("cart.increaseQty")}
                  >
                    <Plus size={22} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-2 text-price hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-semibold"
                  aria-label={`${t("cart.remove")} ${item.name}`}
                >
                  <Trash2 size={22} />
                  <span className="text-body">{t("cart.remove")}</span>
                </button>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-card p-6 rounded-xl shadow-lg border-t-4 border-gold sticky top-24">
              <h2 className="text-h4 font-serif text-teak-dark font-bold mb-6">{t("cart.orderSummary")}</h2>

              <div className="space-y-3 text-body text-text-muted">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span className="text-text-main font-semibold">฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}</span>
                  <span className="text-[#2D6A4F] font-bold">{t("common.free")}</span>
                </div>
                <div className="h-px bg-cream-alt my-4" />
                <div className="flex justify-between text-h4 font-bold text-teak-dark">
                  <span>{t("cart.total")}</span>
                  <span className="text-price">฿{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-8 bg-teak text-cream text-body-lg font-bold py-4 rounded-lg hover:bg-teak-dark shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 min-h-[56px]"
              >
                <CreditCard size={24} />
                {t("cart.checkout")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
