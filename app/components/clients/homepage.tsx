"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Truck, ShieldCheck, Phone, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";
import AddToCartButton from "../ui/AddToCartButton";
import { IProduct } from "@/app/interfaces/product.interface";

const categories = [
  { id: 1, nameKey: "home.cat.cabinets" as const, subKey: "home.cat.cabinetsSub" as const, icon: "🏛️" },
  { id: 2, nameKey: "home.cat.tables" as const, subKey: "home.cat.tablesSub" as const, icon: "🪑" },
  { id: 3, nameKey: "home.cat.carved" as const, subKey: "home.cat.carvedSub" as const, icon: "🪵" },
  { id: 4, nameKey: "home.cat.collectibles" as const, subKey: "home.cat.collectiblesSub" as const, icon: "🏺" },
];

export default function HomepageClient() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
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

  const heroImages = products
    .filter((p) => p.images && p.images.length > 0)
    .slice(0, 5)
    .map((p) => {
      const img = p.images![0].url;
      if (img.startsWith("http")) return img;
      return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img}`;
    });

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const getImageUrl = (item: IProduct) => {
    const img = item.images?.[0]?.url;
    if (!img) return "https://placehold.co/600x400/png?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img}`;
  };

  return (
    <main className="w-full min-h-screen bg-cream text-text-main">

      {/* === HERO === */}
      <section className="relative w-full min-h-[420px] bg-teak-light flex items-center justify-center overflow-hidden">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-teak-dark/70 z-[1]" />
        <div className="relative z-[2] text-center px-6 max-w-4xl mx-auto py-20">
          {user ? (
            <div>
              <p className="text-gold-soft text-body-lg font-semibold mb-2 tracking-widest uppercase">
                {t("home.welcomeBack")}
              </p>
              <h1 className="text-h1 md:text-display font-serif text-cream mb-6 tracking-wide">
                {user.username}
              </h1>
              <p className="text-body-lg text-cream/80 mb-8">
                {t("home.newItemsForYou")}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gold-soft text-body font-semibold mb-4 tracking-widest uppercase">
                {t("home.heroLocation")}
              </p>
              <h1 className="text-h1 md:text-display font-serif text-cream mb-4">
                {t("home.teakCarvings")}
              </h1>
              <h2 className="text-h3 md:text-h2 font-serif text-gold-soft mb-6">
                {t("common.shopName")}
              </h2>
              <p className="text-body-lg text-cream/80 mb-8 max-w-2xl mx-auto">
                {t("home.heroTagline")}
              </p>
            </>
          )}
          <Link
            href="/products"
            className="inline-block bg-gold hover:bg-gold-hover text-cream text-body-lg font-bold py-4 px-10 rounded-lg transition-colors shadow-xl min-h-[56px]"
          >
            {t("home.browseCollection")}
          </Link>
          {heroImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "bg-gold-soft w-6"
                      : "bg-cream/50 hover:bg-cream/80"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === TRUST BADGES === */}
      <section className="py-12 bg-cream-alt border-b border-gold-soft/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">{t("home.since1995")}</h3>
            <p className="text-body text-text-muted">{t("home.since1995sub")}</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">{t("home.authentic100")}</h3>
            <p className="text-body text-text-muted">{t("home.authentic100sub")}</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">{t("home.safeShipping")}</h3>
            <p className="text-body text-text-muted">{t("home.safeShippingSub")}</p>
          </div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-serif text-teak-dark mb-2">{t("home.categories")}</h2>
          <p className="text-body text-text-muted">{t("home.categoriesSub")}</p>
          <div className="h-1 w-24 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href="/products"
              className="bg-card p-6 rounded-xl shadow-md border border-gold-soft/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-h5 font-serif text-teak-dark group-hover:text-gold transition-colors">
                {t(cat.nameKey)}
              </h3>
              <p className="text-sm text-text-muted mt-1">{t(cat.subKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* === NEW ARRIVALS === */}
      <section className="py-20 bg-teak-dark text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-h2 font-serif text-gold-soft">{t("home.newArrivals")}</h2>
              <p className="text-body text-cream/70 mt-1">{t("home.newArrivalsSub")}</p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 text-body-lg border-b-2 border-gold-soft pb-1 text-gold-soft hover:text-cream transition-colors"
            >
              {t("home.seeAll")} →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gold-soft text-body-lg">{t("common.loading")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl overflow-hidden shadow-xl text-text-main flex flex-col"
                >
                  <Link href={`/products/${(item as any).documentId || item.id}`}>
                    <div className="aspect-[4/3] bg-cream-alt relative overflow-hidden">
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="text-h5 font-serif font-bold mb-2 line-clamp-2">
                      {item.name}
                    </h4>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-cream-alt">
                      <span className="text-h4 font-bold text-price">
                        ฿{(item.price ?? 0).toLocaleString()}
                      </span>
                      <AddToCartButton product={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === CONTACT CTA === */}
      <section className="py-16 bg-gold text-teak-dark text-center px-6">
        <div className="max-w-3xl mx-auto">
          <Phone className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-h2 font-serif mb-4">{t("home.interested")}</h2>
          <p className="text-body-lg mb-6">
            {t("home.interestedSub")}
          </p>
          <a
            href="tel:092-3640013"
            className="inline-block bg-teak-dark text-cream text-body-lg font-bold py-4 px-10 rounded-lg hover:bg-teak transition-colors shadow-lg min-h-[56px]"
          >
            {t("home.callUs")}
          </a>
        </div>
      </section>
    </main>
  );
}
