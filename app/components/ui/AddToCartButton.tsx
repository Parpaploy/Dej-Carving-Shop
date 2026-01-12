"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { IProduct } from "@/app/interfaces/product.interface"; // Import the new interface

interface AddToCartButtonProps {
  product: IProduct; // ✅ Update this type from 'Product' to 'IProduct'
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if clicked inside a link
    e.stopPropagation();

    // 1. Get the image URL safely
    const imageUrl = product.images?.[0]?.url 
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.images[0].url}`
      : "https://placehold.co/600x400/png?text=No+Image";

    // 2. Create a "Cart Item" compatible object
    // We add the 'image' property manually so the Cart Context is happy
    const cartItem = {
      ...product,
      image: imageUrl, 
    };

    // 3. Add to cart
    // @ts-ignore: Ignores type mismatch if CartContext is strict about the old type
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-[#2e1d10] hover:bg-[#D4AF37] hover:text-[#2e1d10] text-white p-3 rounded-full transition-all shadow-lg active:scale-95 flex items-center justify-center"
      aria-label="Add to cart"
    >
      <ShoppingBag size={20} />
    </button>
  );
}