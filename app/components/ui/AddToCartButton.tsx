"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { IProduct } from "@/app/interfaces/product.interface";

interface AddToCartButtonProps {
  product: IProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rawUrl = product.images?.[0]?.url;
    const imageUrl = !rawUrl
      ? "https://placehold.co/600x400/png?text=No+Image"
      : rawUrl.startsWith("http") ? rawUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${rawUrl}`;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
    };

    addToCart(cartItem);
    toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-gold hover:bg-gold-hover text-cream px-5 py-3 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 font-semibold text-body min-h-[48px]"
      aria-label={`เพิ่ม ${product.name} ลงตะกร้า`}
    >
      <ShoppingBag size={22} />
      <span>ใส่ตะกร้า</span>
    </button>
  );
}
