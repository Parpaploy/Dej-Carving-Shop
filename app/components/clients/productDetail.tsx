"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { IProduct } from "@/app/interfaces/product.interface";
import AddToCartButton from "../ui/AddToCartButton";
import { ArrowLeft, Truck, ShieldCheck, Phone } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "https://placehold.co/600x600/png?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

export default function ProductDetailClient({ product }: { product: IProduct }) {
  const { t } = useLocale();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => { setSelectedImageIndex(0); }, [product.id]);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const safeIndex = selectedImageIndex < images.length ? selectedImageIndex : 0;

  const activeImage = images.length > 0
    ? getImageUrl(images[safeIndex].url)
    : "https://placehold.co/600x600/png?text=No+Image";

  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* BREADCRUMB */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-text-muted hover:text-gold mb-8 font-medium transition-colors text-body"
        >
          <ArrowLeft size={20} /> {t("product.backToShop")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* LEFT: IMAGE GALLERY (3/5 width on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="aspect-square bg-card rounded-xl shadow-lg overflow-hidden border border-gold-soft/20">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      safeIndex === index
                        ? "border-gold ring-2 ring-gold/30"
                        : "border-cream-alt opacity-70 hover:opacity-100"
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

          {/* RIGHT: PRODUCT INFO (2/5 width on desktop) */}
          <div className="md:col-span-2 flex flex-col">
            <h1 className="text-h2 md:text-h1 font-serif text-teak-dark font-bold mb-4 leading-tight">
              {product.name}
            </h1>

            {/* PRICE CARD */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-gold-soft/20 mb-6">
              <div className="flex justify-between items-center border-b border-cream-alt pb-4 mb-4">
                <span className="text-body text-text-muted">{t("product.price")}</span>
                <span className="text-h3 font-bold text-price">
                  ฿ {(product.price ?? 0).toLocaleString()}
                </span>
              </div>

              <AddToCartButton product={product} />

              <p className="text-center text-sm text-text-muted mt-3">
                {t("product.inStock")}
              </p>
            </div>

            {/* CALL US */}
            <a
              href="tel:092-3640013"
              className="flex items-center justify-center gap-3 bg-gold text-cream py-4 rounded-lg font-bold text-body hover:bg-gold-hover transition-colors mb-6 min-h-[56px]"
            >
              <Phone size={22} />
              {t("product.callToInquire")}
            </a>

            {/* DESCRIPTION */}
            <div className="prose prose-lg max-w-none mb-8">
              <h3 className="text-h4 font-serif text-teak-dark mb-2 border-b-2 border-gold inline-block pb-1">
                {t("product.details")}
              </h3>
              <div className="mt-4 leading-relaxed text-body text-text-main">
                {product.description ? (
                  <BlocksRenderer content={product.description} />
                ) : (
                  <p className="text-text-muted">{t("product.noDescription")}</p>
                )}
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-cream-alt p-4 rounded-lg text-teak-dark">
                <ShieldCheck size={28} className="text-gold flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{t("product.genuineTeak")}</p>
                  <p className="text-xs text-text-muted">{t("product.genuineTeakSub")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-cream-alt p-4 rounded-lg text-teak-dark">
                <Truck size={28} className="text-gold flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{t("product.safeShipping")}</p>
                  <p className="text-xs text-text-muted">{t("product.safeShippingSub")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
