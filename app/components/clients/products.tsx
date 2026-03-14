"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { IProduct } from "@/app/interfaces/product.interface";
import { ICategory } from "@/app/interfaces/category.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";
import { fixSupabaseUrl } from "@/app/lib/strapi";
import { motion } from "framer-motion";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "https://placehold.co/400x400/png?text=No+Image";
  if (url.startsWith("http")) return fixSupabaseUrl(url);
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

function ProductCard({ product, index }: { product: IProduct; index: number }) {
  const images = product.images?.length ? product.images : [];
  const hasMultiple = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const linkId = product.documentId || product.id;
  const cats = product.categories || [];

  const goNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <motion.div
      className="group flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link href={`/products/${linkId}`}>
        <div
          className="relative aspect-square bg-[#F5EDE0] overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setActiveIndex(0); }}
        >
          {images.length > 0 ? images.map((img, i) => (
            <img
              key={i}
              src={getImageUrl(img.url)}
              alt={`${product.name} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              } ${isHovering && i === activeIndex ? "scale-105" : "scale-100"}`}
            />
          )) : (
            <img
              src="https://placehold.co/400x400/png?text=No+Image"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}

          {hasMultiple && isHovering && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={14} className="text-[#3D2B1F]" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={14} className="text-[#3D2B1F]" />
              </button>
            </>
          )}

          {hasMultiple && (
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex(i); }}
                  className={`rounded-full transition-all ${
                    i === activeIndex ? "w-3 h-1 bg-white" : "w-1 h-1 bg-white/50"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="pt-4 text-center">
        <h2 className="text-sm font-medium text-[#3D2B1F] group-hover:text-[#C49A3C] transition-colors leading-snug">
          <Link href={`/products/${linkId}`}>
            {product.name}
          </Link>
        </h2>
        {cats.length > 0 && (
          <p className="text-xs text-[#7A6455] mt-1">{cats.map((c) => c.name).join(", ")}</p>
        )}
        <p className="text-sm font-semibold text-[#3D2B1F] mt-1.5">
          ฿{(product.price ?? 0).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProductsClient({ products, categories = [], activeCategory }: { products: IProduct[]; categories?: ICategory[]; activeCategory?: string }) {
  const { t } = useLocale();

  return (
    <main className="w-full min-h-screen bg-[#FDF8F0]">
      <div className="max-w-[1400px] mx-auto flex">

        {/* Sidebar */}
        <motion.aside
          className="hidden md:block w-60 shrink-0 border-r border-[#E8DFD0] py-10 pr-8 pl-6 sticky top-0 h-screen overflow-y-auto"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#3D2B1F] mb-6">{t("products.title")}</h2>

          <nav className="flex flex-col gap-1">
            <Link
              href="/products"
              className={`text-sm py-1.5 transition-colors ${
                !activeCategory ? "text-[#C49A3C] font-semibold" : "text-[#7A6455] hover:text-[#3D2B1F]"
              }`}
            >
              {t("common.all")} ({products.length})
            </Link>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`text-sm py-1.5 block transition-colors ${
                    activeCategory === cat.slug ? "text-[#C49A3C] font-semibold" : "text-[#7A6455] hover:text-[#3D2B1F]"
                  }`}
                >
                  {cat.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {activeCategory && (
            <Link
              href="/products"
              className="inline-block mt-6 text-xs text-[#7A6455] hover:text-[#3D2B1F] underline underline-offset-2 transition-colors"
            >
              {t("products.resetFilter")}
            </Link>
          )}
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 py-10 px-6">

          {/* Mobile category bar */}
          <motion.div
            className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/products"
              className={`shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
                !activeCategory ? "bg-[#3D2B1F] text-[#FDF8F0] border-[#3D2B1F]" : "border-[#D4C4A8] text-[#7A6455] hover:border-[#3D2B1F]"
              }`}
            >
              {t("common.all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
                  activeCategory === cat.slug ? "bg-[#3D2B1F] text-[#FDF8F0] border-[#3D2B1F]" : "border-[#D4C4A8] text-[#7A6455] hover:border-[#3D2B1F]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </motion.div>

          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-lg font-medium text-[#3D2B1F]">
              {activeCategory ? activeCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : t("products.title")}
            </h1>
            <span className="text-sm text-[#7A6455]">{products.length} {t("common.items")}</span>
          </motion.div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {products.length === 0 && (
            <motion.div
              className="text-center py-20 text-[#7A6455]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg">{t("products.noProducts")}</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
