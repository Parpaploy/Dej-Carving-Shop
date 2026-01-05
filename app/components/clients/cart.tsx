"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext"; // Ensure you created this in the previous step
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";

export default function CartClient() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  // --- 1. EMPTY STATE DESIGN ---
  // If the cart is empty, show a friendly message and a button to go back.
  if (cart.length === 0) {
    return (
      <main className="w-full min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gray-200 p-8 rounded-full mb-6">
          <ShoppingBag size={64} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-serif text-[#4B3621] mb-4 font-bold">Your Cart is Empty</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          It looks like you haven't added any antiques to your collection yet.
        </p>
        <Link 
          href="/" 
          className="bg-[#D4AF37] text-[#2e1d10] text-xl font-bold py-4 px-10 rounded shadow-lg hover:bg-[#b5952f] transition-colors"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  // --- 2. FILLED CART DESIGN ---
  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER: Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Back to shop">
            <ArrowLeft size={32} className="text-[#4B3621]" />
          </Link>
          <h1 className="text-4xl font-serif text-[#4B3621] font-bold">Shopping Cart</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT SIDE: CART ITEMS LIST --- */}
          <div className="flex-grow flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row gap-6 items-center relative">
                
                {/* Product Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-300">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Text */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-2xl font-serif text-[#2e1d10] font-bold mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xl text-[#8B0000] font-bold">
                    ฿ {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls (Large & Accessible) */}
                <div className="flex items-center gap-4 bg-[#FAF9F6] rounded-lg p-2 border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded shadow text-[#2e1d10] hover:bg-[#D4AF37] active:scale-95 transition-all"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={24} />
                  </button>
                  
                  <span className="text-2xl font-bold w-12 text-center text-[#2e1d10]">
                    {item.quantity}
                  </span>

                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded shadow text-[#2e1d10] hover:bg-[#D4AF37] active:scale-95 transition-all"
                    aria-label="Increase quantity"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded transition-colors font-semibold border border-transparent hover:border-red-200"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={24} />
                  <span className="text-lg">Remove</span>
                </button>
              </div>
            ))}
          </div>

          {/* --- RIGHT SIDE: ORDER SUMMARY --- */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-8 border-[#D4AF37] sticky top-8">
              <h2 className="text-2xl font-serif text-[#4B3621] font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-lg text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>฿ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                
                <div className="h-[1px] bg-gray-300 my-4"></div>
                
                <div className="flex justify-between text-3xl font-bold text-[#2e1d10]">
                  <span>Total</span>
                  <span className="text-[#8B0000]">฿ {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button className="w-full mt-8 bg-[#4B3621] text-white text-xl font-bold py-5 rounded hover:bg-[#2e1d10] shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                <CreditCard size={28} />
                Proceed to Checkout
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-60">
                {/* Visual Trust Signals (Icons usually go here) */}
                <div className="w-10 h-6 bg-gray-300 rounded"></div>
                <div className="w-10 h-6 bg-gray-300 rounded"></div>
                <div className="w-10 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}