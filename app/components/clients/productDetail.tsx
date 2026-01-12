"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { IProduct } from "@/app/interfaces/product.interface";
import AddToCartButton from "../ui/AddToCartButton"; // Uses the juicy button we made
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";

// Helper to handle image URLs safely
const getImageUrl = (url: string) => {
  if (!url) return "https://placehold.co/600x600/png?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

export default function ProductDetailClient({ product }: { product: IProduct }) {
  // 1. State for Image Gallery (Defaults to the first image)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Safety check: Ensure images array exists
  const images = product.images && product.images.length > 0 ? product.images : [];
  
  // Get the currently active image URL
  const activeImage = images.length > 0 
    ? getImageUrl(images[selectedImageIndex].url) 
    : "https://placehold.co/600x600/png?text=No+Image";

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* --- BREADCRUMB --- */}
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#D4AF37] mb-8 font-medium transition-colors">
          <ArrowLeft size={20} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="flex flex-col gap-4">
            
            {/* Main Large Image */}
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails (Only show if more than 1 image) */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30" 
                        : "border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={getImageUrl(img.url)} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-[#4B3621] font-bold mb-4 leading-tight">
              {product.name}
            </h1>

                      {/* Price Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 text-lg">Price</span>
                <span className="text-3xl font-bold text-[#8B0000]">
                  ฿ {product.price.toLocaleString()}
                </span>
              </div>
              
              {/* Juicy Add to Cart Button */}
              <div className="flex flex-col gap-2">
                {/* ✅ FIX: Pass the full 'product' object directly. 
                  It already contains the correct 'images' array. */}
                <AddToCartButton product={product} />
                
                <p className="text-center text-sm text-gray-500 mt-2">
                  <span className="text-green-600 font-bold">In Stock</span> & ready to ship.
                </p>
              </div>
            </div>

            {/* Description (Rich Text) */}
            <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="text-2xl font-serif text-[#4B3621] mb-2 border-b-2 border-[#D4AF37] inline-block pb-1">
                Item History & Details
              </h3>
              <div className="mt-4 leading-relaxed">
                <BlocksRenderer content={product.description} />
              </div>
            </div>

            {/* Trust Badges (Reassurance) */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-[#EBE8E1] p-4 rounded text-[#4B3621]">
                <ShieldCheck size={32} />
                <span className="font-bold">Verified Authentic</span>
              </div>
              <div className="flex items-center gap-3 bg-[#EBE8E1] p-4 rounded text-[#4B3621]">
                <Truck size={32} />
                <span className="font-bold">Safe Shipping</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}