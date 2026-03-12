"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { IProduct } from "@/app/interfaces/product.interface";
import AddToCartButton from "../ui/AddToCartButton";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";
import { fixSupabaseUrl } from "@/app/lib/strapi";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "https://placehold.co/400x400/png?text=No+Image";
  if (url.startsWith("http")) return fixSupabaseUrl(url);
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

const blocksToText = (blocks: unknown): string => {
  try {
    return (blocks as any)?.map((b: any) => b.children?.map((c: any) => c.text).join("")).join(" ") || "";
  } catch {
    return "";
  }
};

function ProductCard({ product }: { product: IProduct }) {
  const images = product.images?.length ? product.images : [];
  const hasMultiple = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const linkId = (product as any).documentId || product.id;
  const cats = product.categories || [];
  const desc = blocksToText(product.description);

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
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* IMAGE CAROUSEL */}
      <div
        className="relative aspect-[4/3] bg-cream-alt overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setActiveIndex(0); }}
      >
        {/* All images stacked, crossfade */}
        {images.length > 0 ? images.map((img, i) => (
          <Link key={i} href={`/products/${linkId}`} className="absolute inset-0">
            <img
              src={getImageUrl(img.url)}
              alt={`${product.name} ${i + 1}`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } ${isHovering && i === activeIndex ? "scale-110" : ""}`}
            />
          </Link>
        )) : (
          <Link href={`/products/${linkId}`} className="absolute inset-0">
            <img
              src="https://placehold.co/400x400/png?text=No+Image"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </Link>
        )}

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Category badges */}
        {cats.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {cats.map((cat) => (
              <span key={cat.id} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-teak-dark text-xs font-semibold rounded-full shadow-sm">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Arrows — only show on hover when multiple images */}
        {hasMultiple && isHovering && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-teak-dark" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-teak-dark" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultiple && (
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-serif font-bold text-teak-dark leading-snug mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
          <Link href={`/products/${linkId}`}>
            {product.name}
          </Link>
        </h2>

        {/* DESCRIPTION SUB-CARD */}
        {desc && (
          <div className="bg-cream/60 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
              {desc}
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-price">
            ฿{(product.price ?? 0).toLocaleString()}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsClient({ products, activeCategory }: { products: IProduct[]; activeCategory?: string }) {
  const { t } = useLocale();

  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gold-soft/30 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-cream-alt rounded-full transition-colors" aria-label={t("products.backToHome")}>
              <ArrowLeft size={32} className="text-teak-dark" />
            </Link>
            <div>
              <h1 className="text-h2 font-serif text-teak-dark font-bold">{t("products.title")}</h1>
              <p className="text-text-muted mt-1 text-body">{t("products.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeCategory && (
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 bg-teak/10 text-teak-dark rounded-full text-body font-medium hover:bg-teak/20 transition-colors"
              >
                <span className="capitalize">{activeCategory.replace(/-/g, " ")}</span>
                <X size={16} />
              </Link>
            )}
            <p className="text-body text-text-muted">{products.length} {t("common.items")}</p>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
