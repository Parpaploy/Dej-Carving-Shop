"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, Truck, ShieldCheck, Phone } from "lucide-react";
import { useCart } from "../../context/CartContext"; 
import AddToCartButton from "../ui/AddToCartButton";
import { toast } from "sonner"; 
// Mock Data (Same as before)
const CATEGORIES = [
  { id: 1, name: "Hand-Carved Statues", image: "https://placehold.co/400x400/4B3621/FFF?text=Carvings" },
  { id: 2, name: "Antique Cabinets", image: "https://placehold.co/400x400/5C4033/FFF?text=Cabinets" },
  { id: 3, name: "Wall Decor", image: "https://placehold.co/400x400/8B4513/FFF?text=Decor" },
];

const FEATURED_ITEMS = [
  { id: 1, name: "Teak Wood Elephant", price: 4500, image: "https://placehold.co/300x300/e5e5e5/333?text=Elephant" },
  { id: 2, name: "Vintage Brass Lamp", price: 2800, image: "https://placehold.co/300x300/e5e5e5/333?text=Lamp" },
  { id: 3, name: "Rosewood Box", price: 1200, image: "https://placehold.co/300x300/e5e5e5/333?text=Box" },
  { id: 4, name: "Ceramic Vase 1980", price: 3500, image: "https://placehold.co/300x300/e5e5e5/333?text=Vase" },
];

export default function HomepageClient() {
  // 1. STATE TO HOLD USER DATA
  const [user, setUser] = useState<any>(null);
  const { addToCart } = useCart(); // <--- Get the add function
  // 2. CHECK LOGIN STATUS ON LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[500px] bg-[#2e1d10] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* 3. DYNAMIC GREETING */}
          {user ? (
             // IF LOGGED IN: Show personalized welcome
             <div className="animate-fade-in">
               <p className="text-[#D4AF37] text-xl font-bold mb-2 uppercase tracking-widest">
                 Welcome Back
               </p>
               <h1 className="text-4xl md:text-6xl font-serif text-[#F5F5DC] mb-6 tracking-wide drop-shadow-md">
                 Khun {user.username}
               </h1>
               <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                 We found some new antiques you might like.
               </p>
             </div>
          ) : (
             // IF NOT LOGGED IN: Show standard welcome
             <>
              <h1 className="text-4xl md:text-6xl font-serif text-[#F5F5DC] mb-6 tracking-wide drop-shadow-md">
                Timeless Wood & Collectibles
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                Preserving the craft of the past for your home today.
              </p>
             </>
          )}

          <button className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#2e1d10] text-xl font-bold py-4 px-10 rounded-md transition-colors shadow-lg border-2 border-[#F5F5DC]/20">
            View Collection
          </button>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-12 bg-[#EBE8E1] border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-[#4B3621] mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#4B3621]">Authentic Guarantee</h3>
            <p className="text-lg text-gray-600">Every item verified for age and quality.</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-12 h-12 text-[#4B3621] mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#4B3621]">Safe Shipping</h3>
            <p className="text-lg text-gray-600">Packaged with care to prevent damage.</p>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="w-12 h-12 text-[#4B3621] mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#4B3621]">Call Us Anytime</h3>
            <p className="text-lg text-gray-600">08X-XXX-XXXX (Daily 9am - 6pm)</p>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-[#4B3621] mb-2">Browse by Category</h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="cursor-pointer group">
              <div className="bg-white p-3 shadow-lg border border-gray-200 rounded-sm transform transition duration-300 group-hover:-translate-y-2">
                <div className="aspect-square overflow-hidden bg-gray-200">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-center mt-4 text-2xl font-serif text-[#4B3621] group-hover:text-[#D4AF37] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-20 bg-[#4B3621] text-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#D4AF37]">New Arrivals</h2>
            <button className="cursor-pointer mt-4 md:mt-0 text-xl border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37]">
              See All Items &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_ITEMS.map((item) => (
              <div key={item.id} className="bg-[#FAF9F6] rounded-lg overflow-hidden shadow-xl text-[#2C2C2C] flex flex-col">
                <div className="aspect-[4/3] bg-gray-300 relative">
                   <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="text-xl font-serif font-bold mb-2 line-clamp-2">{item.name}</h4>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-200">
                    <span className="text-2xl font-bold text-[#8B0000]">฿{item.price.toLocaleString()}</span>
                       <AddToCartButton product={item} />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      {/* --- FOOTER --- */}
      <section className="py-16 bg-[#D4AF37] text-center px-4">
        <h2 className="text-3xl font-serif text-[#2e1d10] mb-4">Visit Our Shop in Person</h2>
        <p className="text-xl text-[#2e1d10] mb-8">We have many more unlisted items in our showroom.</p>
        
        <button 
          className="cursor-pointer bg-[#2e1d10] text-white text-lg font-bold py-3 px-8 rounded hover:bg-black transition-colors" 
          onClick={() => window.open("https://maps.app.goo.gl/SFvUEiisuZ27QvQo8", "_blank")}
        >
          Get Directions
        </button>
      </section>

    </main>
  );
}