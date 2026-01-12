"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Truck, ShieldCheck, Phone, MapPin } from "lucide-react";
import { useCart } from "../../context/CartContext"; 
import AddToCartButton from "../ui/AddToCartButton";
import { toast } from "sonner"; 
import { IProduct } from "@/app/interfaces/product.interface"; 

// Static Categories
const CATEGORIES = [
  { id: 1, name: "Furniture", image: "https://placehold.co/400x400/png?text=Furniture" },
  { id: 2, name: "Carvings", image: "https://placehold.co/400x400/png?text=Carvings" },
  { id: 3, name: "Amulets", image: "https://placehold.co/400x400/png?text=Amulets" },
];

export default function HomepageClient() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`);
        setProducts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (item: IProduct) => {
    const img = item.images?.[0]?.url;
    if (!img) return "https://placehold.co/600x400/png?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img}`;
  };

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[500px] bg-[#2e1d10] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {user ? (
             <div className="animate-fade-in">
               <p className="text-[#D4AF37] text-xl font-bold mb-2 uppercase tracking-widest">Welcome Back</p>
               <h1 className="text-4xl md:text-6xl font-serif text-[#F5F5DC] mb-6 tracking-wide drop-shadow-md">
                  {user.username}
               </h1>
               <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                 We found some new antiques you might like.
               </p>
             </div>
          ) : (
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
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-center mt-4 text-2xl font-serif text-[#4B3621] group-hover:text-[#D4AF37] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* --- NEW ARRIVALS --- */}
      <section className="py-20 bg-[#4B3621] text-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#D4AF37]">New Arrivals</h2>
            <button className="cursor-pointer mt-4 md:mt-0 text-xl border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37]">
              See All Items →
            </button>
          </div>

          {loading ? (
             <div className="text-center py-20 text-[#D4AF37]">Loading antiques...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((item) => (
                <div key={item.id} className="bg-[#FAF9F6] rounded-lg overflow-hidden shadow-xl text-[#2C2C2C] flex flex-col">
                  <div className="aspect-[4/3] bg-gray-300 relative">
                     <img src={getImageUrl(item)} alt={item.name} className="w-full h-full object-cover" />
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
          )}
        </div>
      </section>

      {/* --- FOOTER / MAP SECTION --- */}
      <section className="py-16 bg-[#D4AF37] text-center px-4">
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#2e1d10] mb-4">Visit Our Showroom</h2>
                <div className="flex items-center justify-center gap-2 text-[#2e1d10] text-lg">
                    <MapPin />
                    <p>Ban Tawai Wood Carving Village, Chiang Mai</p>
                </div>
                <p className="text-[#2e1d10]/80 mt-2">Open Daily: 9:00 AM - 6:00 PM</p>
            </div>
            
            {/* GOOGLE MAPS EMBED */}
            <div className="w-full h-[400px] bg-gray-200 rounded-lg shadow-xl overflow-hidden border-4 border-[#2e1d10]">
                {/* 👇👇👇 PASTE YOUR NEW LINK BELOW 👇👇👇 
                   It should look like: https://www.google.com/maps/embed?pb=!1m18!1m12...
                */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.424808573954!2d98.9436499759203!3d18.689789982436906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3114739e5ed7%3A0x80588edbe66d9927!2sDej%20Carving%20Shop!5e0!3m2!1sen!2sth!4v1768211258487!5m2!1sen!2sth" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shop Location"
                ></iframe>
            </div>
        </div>
      </section>

    </main>
  );
}