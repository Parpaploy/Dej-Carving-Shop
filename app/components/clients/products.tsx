"use client";

import React from "react";
import Link from "next/link";
import { IProduct } from "@/app/interfaces/product.interface";
import AddToCartButton from "../ui/AddToCartButton";
import { ArrowLeft, X } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "https://placehold.co/400x400/png?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

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
          {products.map((product) => {
            const firstImage = product.images && product.images.length > 0 ? product.images[0].url : "";
            const imageUrl = getImageUrl(firstImage);
            const linkId = (product as any).documentId || product.id;

            return (
              <div
                key={product.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden flex flex-col h-full border border-gold-soft/20 hover:shadow-xl transition-shadow duration-300"
              >
                {/* IMAGE */}
                <Link href={`/products/${linkId}`} className="relative aspect-[4/3] bg-cream-alt overflow-hidden group">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* CARD CONTENT */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-h5 font-serif font-bold text-teak-dark leading-tight mb-3">
                    <Link href={`/products/${linkId}`} className="hover:text-gold transition-colors">
                      {product.name}
                    </Link>
                  </h2>

                  {/* FOOTER */}
                  <div className="mt-auto pt-4 border-t border-cream-alt flex items-center justify-between">
                    <span className="text-h4 font-bold text-price">
                      ฿ {(product.price ?? 0).toLocaleString()}
                    </span>
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
