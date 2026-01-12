"use client";

import React from "react";
import Link from "next/link";
import { IProduct } from "@/app/interfaces/product.interface"; 
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import AddToCartButton from "../ui/AddToCartButton"; 
import { ArrowLeft, Filter } from "lucide-react";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "https://placehold.co/400x400/png?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

export default function ProductsClient({ products }: { products: IProduct[] }) {
  
  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#D4AF37]/30 pb-6">
          <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Back to home">
               <ArrowLeft size={32} className="text-[#4B3621]" />
             </Link>
             <div>
               <h1 className="text-4xl font-serif text-[#4B3621] font-bold">The Collection</h1>
               <p className="text-gray-600 mt-1 text-lg">Browse our curated selection of antiques.</p>
             </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-[#4B3621] text-[#4B3621] font-bold rounded hover:bg-[#4B3621] hover:text-white transition-colors">
            <Filter size={20} /> Filter Items
          </button>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => {
            
            // Access the first image safely for the card display
            const firstImage = product.images && product.images.length > 0 ? product.images[0].url : "";
            const imageUrl = getImageUrl(firstImage);

            // Use documentId if available (Strapi v5), otherwise id
            const linkId = (product as any).documentId || product.id;

            return (
              <div key={product.id} className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                
                {/* 1. IMAGE AREA */}
                <Link href={`/products/${linkId}`} className="relative h-72 bg-gray-200 overflow-hidden group">
                   <img 
                     src={imageUrl} 
                     alt={product.name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                {/* 2. CARD CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-serif font-bold text-[#2e1d10] leading-tight">
                      <Link href={`/products/${linkId}`} className="hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </Link>
                    </h2>
                  </div>

                  {/* Limit description height */}
                  <div className="text-gray-600 text-base mb-6 line-clamp-3 prose prose-sm prose-headings:hidden">
                    <BlocksRenderer content={product.description} />
                  </div>

                  {/* 3. FOOTER ACTIONS */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#8B0000]">
                      ฿ {product.price.toLocaleString()}
                    </span>

                    {/* ✅ FIX: Pass the WHOLE product object. The button handles the image logic. */}
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}