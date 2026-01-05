"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner"; // Notification library
import { useCart } from "../../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = () => {
    // 1. Add to context
    addToCart({ ...product, quantity: 1 });
    
    // 2. Trigger "Success" state for animation
    setIsSuccess(true);
    
    // 3. Trigger "Juicy" Toast Notification
    toast.success(`${product.name} added to cart!`, {
      style: { background: "#2e1d10", color: "#FAF9F6", border: "1px solid #D4AF37" },
    });

    // 4. Reset button after 2 seconds
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }} // The "Squish" effect
      animate={{ 
        backgroundColor: isSuccess ? "#22c55e" : "#2C2C2C", // Black -> Green
        color: "#fff"
      }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer p-3 rounded shadow-lg flex items-center justify-center min-w-[50px] transition-colors"
      aria-label="Add to cart"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1.2, rotate: 0 }}
            exit={{ scale: 0 }}
          >
            <Check size={24} className="font-bold" />
          </motion.div>
        ) : (
          <motion.div
            key="bag"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <ShoppingBag size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}