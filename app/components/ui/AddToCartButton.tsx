"use client";

import React, { useState, useCallback } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLocale } from "@/app/context/LocaleContext";
import { toast } from "sonner";
import { IProduct } from "@/app/interfaces/product.interface";

interface AddToCartButtonProps {
  product: IProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { t } = useLocale();
  const [added, setAdded] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;

    const rawUrl = product.images?.[0]?.url;
    const imageUrl = !rawUrl
      ? "https://placehold.co/600x400/png?text=No+Image"
      : rawUrl.startsWith("http") ? rawUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${rawUrl}`;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
    });

    toast.success(`${product.name} — ${t("toast.addedToCart")}`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [added, product, addToCart, t]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - rect.top}px`);
    e.currentTarget.style.setProperty("--go", "1");
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--go", "0");
  }, []);

  return (
    <button
      onClick={handleAddToCart}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 font-semibold text-body min-h-[48px] px-5 py-3 ${
        added
          ? "bg-emerald-500 text-white scale-105"
          : "text-white hover:shadow-xl active:scale-95"
      }`}
      style={{ "--gx": "50%", "--gy": "50%", "--go": "0", backgroundColor: added ? undefined : "#3D2B1F" } as React.CSSProperties}
      aria-label={`${t("product.addToCart")} ${product.name}`}
    >
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(100px circle at var(--gx) var(--gy), rgba(255,255,255,0.2), transparent 70%)",
          opacity: added ? "0" : "var(--go)",
        }}
      />
      <span className={`relative z-10 flex items-center gap-2 transition-all duration-300 ${added ? "animate-[bounceIn_0.4s_ease-out]" : ""}`}>
        {added ? (
          <>
            <Check size={22} />
            <span>{t("toast.addedToCart")}</span>
          </>
        ) : (
          <>
            <ShoppingBag size={22} />
            <span>{t("product.addToCart")}</span>
          </>
        )}
      </span>
    </button>
  );
}
