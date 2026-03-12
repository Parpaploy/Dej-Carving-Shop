"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Truck, ShieldCheck, Phone, Award, ArrowRight, Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion , Variants } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";
import AddToCartButton from "../ui/AddToCartButton";
import { IProduct } from "@/app/interfaces/product.interface";
import { fixSupabaseUrl } from "@/app/lib/strapi";

const categories = [
  { id: 1, nameKey: "home.cat.cabinets" as const, subKey: "home.cat.cabinetsSub" as const, icon: "🏛️" },
  { id: 2, nameKey: "home.cat.tables" as const, subKey: "home.cat.tablesSub" as const, icon: "🪑" },
  { id: 3, nameKey: "home.cat.carved" as const, subKey: "home.cat.carvedSub" as const, icon: "🪵" },
  { id: 4, nameKey: "home.cat.collectibles" as const, subKey: "home.cat.collectiblesSub" as const, icon: "🏺" },
];

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export default function HomepageClient() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fallbackHeroImages = [
    "/images/hero/shop-front.jpg",
    "/images/hero/workshop.jpg",
    "/images/hero/showroom.jpg",
  ];
  const [heroImages, setHeroImages] = useState<string[]>(fallbackHeroImages);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, heroRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`),
          axios.get(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/hero-banner?populate=*`).catch(() => null),
        ]);
        setProducts(productsRes.data.data);

        const heroData = heroRes?.data?.data?.images;
        if (heroData && heroData.length > 0) {
          setHeroImages(
            heroData.map((img: any) => {
              const url = img.url;
              if (!url) return null;
              if (url.startsWith("http")) return url;
              return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
            }).filter(Boolean)
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const getImageUrl = (item: IProduct) => {
    const img = item.images?.[0]?.url;
    if (!img) return "https://placehold.co/600x400/png?text=No+Image";
    if (img.startsWith("http")) return fixSupabaseUrl(img);
    return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img}`;
  };

  const blocksToText = (blocks: unknown): string => {
    try {
      return (blocks as any)?.map((b: any) => b.children?.map((c: any) => c.text).join("")).join(" ") || "";
    } catch {
      return "";
    }
  };

  return (
    <main className="w-full min-h-screen bg-cream text-text-main">
      
      {/* === HERO === */}
      <section className="relative w-full min-h-[400px] md:min-h-[480px] bg-teak-dark flex items-center justify-center overflow-hidden">
        {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-teak-dark transition-all duration-1000 ease-in-out" // Added bg-teak-dark here
          style={{
            opacity: i === currentSlide ? 1 : 0,
            transform: i === currentSlide ? "scale(1)" : "scale(1.05)",
            zIndex: i === currentSlide ? 1 : 0
          }}
        >
            <img
              src={src}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        ))}
        {/* Richer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-teak-dark/95 z-[2]" />

        <div className="relative z-[3] text-center px-6 max-w-4xl mx-auto py-14">
          <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
            {user ? (
              <div>
                <p className="text-gold-soft text-sm md:text-base font-bold mb-3 tracking-[0.2em] uppercase">
                  {t("home.welcomeBack")}
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-cream/90 mb-6 tracking-wide drop-shadow-md">
                  {user.username}
                </h1>
                <p className="text-lg md:text-xl text-cream/90 mb-10 font-light">
                  {t("home.newItemsForYou")}
                </p>
              </div>
            ) : (
              <>
                <p className="text-gold-soft text-sm md:text-base font-bold mb-4 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                  <span className="w-8 h-[1px] bg-gold-soft/50"></span>
                  {t("home.heroLocation")}
                  <span className="w-8 h-[1px] bg-gold-soft/50"></span>
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 drop-shadow-lg leading-tight">
                  {t("home.teakCarvings")}
                </h1>
                <h2 className="text-2xl md:text-4xl font-serif text-gold-soft mb-6 drop-shadow-md">
                  {t("common.shopName")}
                </h2>
                <p className="text-lg md:text-xl text-cream/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                  {t("home.heroTagline")}
                </p>
              </>
            )}
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-gold hover:bg-cream text-cream hover:text-teak-dark text-lg font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(107,76,56,0.3)] hover:shadow-[0_8px_30px_rgba(221,217,208,0.4)] hover:-translate-y-1 group"
            >
              {t("home.browseCollection")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Dots Indicator */}
          {heroImages.length > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === currentSlide
                      ? "bg-gold w-8"
                      : "bg-white/40 w-2 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === TRUST BADGES === */}
      <section className="py-16 mt-10 bg-card border-b border-cream-alt shadow-sm relative mx-4 md:mx-auto max-w-6xl rounded-2xl">
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-cream-alt">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col items-center pt-6 md:pt-0 px-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5 text-teak">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-teak-dark mb-2">{t("home.since1995")}</h3>
            <p className="text-text-muted leading-relaxed">{t("home.since1995sub")}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col items-center pt-6 md:pt-0 px-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5 text-teak">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-teak-dark mb-2">{t("home.authentic100")}</h3>
            <p className="text-text-muted leading-relaxed">{t("home.authentic100sub")}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col items-center pt-6 md:pt-0 px-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5 text-teak">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-teak-dark mb-2">{t("home.safeShipping")}</h3>
            <p className="text-text-muted leading-relaxed">{t("home.safeShippingSub")}</p>
          </motion.div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-3xl md:text-4xl font-serif text-teak-dark mb-4">
            {t("home.categories")}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-text-muted max-w-2xl mx-auto text-lg">
            {t("home.categoriesSub")}
          </motion.p>
          <div className="h-1 w-20 bg-gold mx-auto mt-6 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href="/products"
                className="relative block bg-card p-8 rounded-2xl shadow-sm border border-cream-alt hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-center overflow-hidden"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  e.currentTarget.style.setProperty("--glow-opacity", "1");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty("--glow-opacity", "0");
                }}
                style={{ "--mouse-x": "0px", "--mouse-y": "0px", "--glow-opacity": "0" } as React.CSSProperties}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(107,76,56,0.15), transparent 70%)",
                    opacity: "var(--glow-opacity)",
                  }}
                />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-cream flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-teak-dark group-hover:text-gold transition-colors mb-2">
                    {t(cat.nameKey)}
                  </h3>
                  <p className="text-sm text-text-muted">{t(cat.subKey)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === NEW ARRIVALS === */}
      <section className="py-24 bg-teak text-cream relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-gold-soft mb-3">{t("home.newArrivals")}</h2>
              <p className="text-lg text-cream/70 font-light">{t("home.newArrivalsSub")}</p>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-lg text-gold-soft hover:text-white transition-colors pb-1 border-b border-gold-soft/30 hover:border-white"
            >
              {t("home.seeAll")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gold-soft text-xl animate-pulse">{t("common.loading")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HomeProductCard item={item} getImageUrl={getImageUrl} blocksToText={blocksToText} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === CONTACT CTA (Enhanced from image) === */}
      <section className="py-20 bg-gradient-to-br from-teak-light to-teak-dark text-cream text-center px-6 relative overflow-hidden">
        {/* Subtle background patterns for depth */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cream via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="w-20 h-20 mx-auto bg-cream/20 rounded-full flex items-center justify-center mb-6">
            <Phone className="w-10 h-10 text-cream animate-[wiggle_1s_ease-in-out_infinite]" />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-cream font-bold mb-4 drop-shadow-sm">
            {t("home.interested") || "สนใจสินค้า?"}
          </h2>
          <p className="text-lg md:text-xl text-cream/80 mb-10 font-medium">
            {t("home.interestedSub") || "โทรหาเราได้เลย หรือแอดไลน์"}
          </p>

          {/* CTA Buttons Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">

            {/* LINE Button */}
            <a
              href="https://line.me/ti/p/~YOUR_LINE_ID" // 👈 Change this to your actual LINE link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#00B900] text-white text-lg md:text-xl font-bold py-4 px-8 md:px-10 rounded-full hover:bg-[#009900] transition-all duration-300 shadow-[0_10px_20px_rgba(0,185,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,185,0,0.5)] hover:-translate-y-1 w-full sm:w-auto"
            >
              {/* Custom LINE SVG Icon */}
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="w-6 h-6">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.966 8.874 9.421 9.613.37.08.872.247.994.57.108.283.033.722 0 1.009 0 0-.156.947-.193 1.157-.061.353-.284 1.393 1.222.758 1.506-.634 8.125-4.783 10.518-7.757C23.364 14.12 24 12.308 24 10.304z"/>
              </svg>
              {t("home.addLine") || "แอดไลน์"}
            </a>

            {/* Phone Button */}
            <a
              href="tel:092-3640013"
              className="inline-flex items-center justify-center gap-3 bg-[#1d1d1d] text-white text-lg md:text-xl font-bold py-4 px-8 md:px-10 rounded-full hover:bg-[#2a2a2a] hover:text-white transition-all duration-300 shadow-[0_10px_20px_rgba(29,29,29,0.3)] hover:shadow-[0_15px_30px_rgba(29,29,29,0.5)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              {t("home.callUs") || "โทร"} 
            </a>
            
          </div>
        </motion.div>
      </section>
      
    </main>
  );}

function HomeProductCard({ item, getImageUrl, blocksToText }: { item: IProduct; getImageUrl: (item: IProduct) => string; blocksToText: (blocks: unknown) => string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const images = item.images?.length ? item.images : [];
  const hasMultiple = images.length > 1;
  const linkId = item.documentId || item.id;
  const cats = item.categories || [];
  const desc = blocksToText(item.description);

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl text-text-main flex flex-col group transition-all duration-500 hover:-translate-y-1 h-full">
      <div
        className="aspect-[4/3] bg-cream-alt relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setActiveIndex(0); }}
      >
        {images.length > 0 ? images.map((img, i) => (
          <Link key={i} href={`/products/${linkId}`} className="absolute inset-0">
            <img
              src={img.url?.startsWith("http") ? fixSupabaseUrl(img.url) : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img.url}`}
              alt={`${item.name} ${i + 1}`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } ${isHovering && i === activeIndex ? "scale-110" : ""}`}
            />
          </Link>
        )) : (
          <Link href={`/products/${linkId}`} className="absolute inset-0">
            <img src={getImageUrl(item)} alt={item.name} className="w-full h-full object-cover" />
          </Link>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {cats.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {cats.map((cat) => (
              <span key={cat.id} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-teak-dark text-xs font-semibold rounded-full shadow-sm">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {hasMultiple && isHovering && (
          <>
            <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors" aria-label="Previous">
              <ChevronLeft size={18} className="text-teak-dark" />
            </button>
            <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors" aria-label="Next">
              <ChevronRight size={18} className="text-teak-dark" />
            </button>
          </>
        )}

        {hasMultiple && (
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-lg font-serif font-bold mb-3 line-clamp-2 text-teak-dark group-hover:text-gold transition-colors duration-300">
          {item.name}
        </h4>
        {desc && (
          <div className="bg-cream/60 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{desc}</p>
          </div>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-price">฿{(item.price ?? 0).toLocaleString()}</span>
          <AddToCartButton product={item} />
        </div>
      </div>
    </div>
  );
}