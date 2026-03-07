"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Truck, ShieldCheck, Phone, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AddToCartButton from "../ui/AddToCartButton";
import { IProduct } from "@/app/interfaces/product.interface";

const CATEGORIES = [
  { id: 1, name: "ตู้ไม้สัก", sub: "Cabinets", icon: "🏛️" },
  { id: 2, name: "ชุดโต๊ะ", sub: "Table Sets", icon: "🪑" },
  { id: 3, name: "งานแกะสลัก", sub: "Carved Items", icon: "🪵" },
  { id: 4, name: "ของสะสม", sub: "Collectibles", icon: "🏺" },
];

export default function HomepageClient() {
  const { user } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getImageUrl = (item: IProduct) => {
    const img = item.images?.[0]?.url;
    if (!img) return "https://placehold.co/600x400/png?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img}`;
  };

  return (
    <main className="w-full min-h-screen bg-cream text-text-main">

      {/* === HERO === */}
      <section className="relative w-full min-h-[420px] bg-teak-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-teak-dark/80 z-0" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20">
          {user ? (
            <div>
              <p className="text-gold-soft text-body-lg font-semibold mb-2 tracking-widest uppercase">
                ยินดีต้อนรับกลับ / Welcome Back
              </p>
              <h1 className="text-h1 md:text-display font-serif text-cream mb-6 tracking-wide">
                {user.username}
              </h1>
              <p className="text-body-lg text-cream/80 mb-8">
                เราพบสินค้าใหม่ที่คุณอาจชอบ
              </p>
            </div>
          ) : (
            <>
              <p className="text-gold-soft text-body font-semibold mb-4 tracking-widest uppercase">
                บ้านถวาย เชียงใหม่
              </p>
              <h1 className="text-h1 md:text-display font-serif text-cream mb-4">
                งานแกะสลักไม้สัก
              </h1>
              <h2 className="text-h3 md:text-h2 font-serif text-gold-soft mb-6">
                ร้านเดชแกะสลัก
              </h2>
              <p className="text-body-lg text-cream/80 mb-8 max-w-2xl mx-auto">
                Timeless Teak. Carved by Hand.
              </p>
            </>
          )}
          <Link
            href="/products"
            className="inline-block bg-gold hover:bg-gold-hover text-cream text-body-lg font-bold py-4 px-10 rounded-lg transition-colors shadow-xl min-h-[56px]"
          >
            ดูสินค้าทั้งหมด / Browse Collection
          </Link>
        </div>
      </section>

      {/* === TRUST BADGES === */}
      <section className="py-12 bg-cream-alt border-b border-gold-soft/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">ตั้งแต่ปี 1995</h3>
            <p className="text-body text-text-muted">Since 1995 — 30+ Years of Craftsmanship</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">ไม้สักแท้ 100%</h3>
            <p className="text-body text-text-muted">100% Authentic Teak — Verified Quality</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-14 h-14 text-teak mb-3" />
            <h3 className="text-h5 font-serif font-bold text-teak-dark">จัดส่งปลอดภัย</h3>
            <p className="text-body text-text-muted">Safe Shipping — Packaged with Care</p>
          </div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-serif text-teak-dark mb-2">หมวดหมู่สินค้า</h2>
          <p className="text-body text-text-muted">Browse by Category</p>
          <div className="h-1 w-24 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href="/products"
              className="bg-card p-6 rounded-xl shadow-md border border-gold-soft/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-h5 font-serif text-teak-dark group-hover:text-gold transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-text-muted mt-1">{cat.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* === NEW ARRIVALS === */}
      <section className="py-20 bg-teak-dark text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-h2 font-serif text-gold-soft">สินค้ามาใหม่</h2>
              <p className="text-body text-cream/70 mt-1">New Arrivals</p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 text-body-lg border-b-2 border-gold-soft pb-1 text-gold-soft hover:text-cream transition-colors"
            >
              ดูทั้งหมด / See All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gold-soft text-body-lg">กำลังโหลด...</div>
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
          <h2 className="text-h2 font-serif mb-4">สนใจสินค้า?</h2>
          <p className="text-body-lg mb-6">
            โทรหาเราได้เลย หรือแอดไลน์ — Interested? Call or LINE us anytime
          </p>
          <a
            href="tel:08XXXXXXXX"
            className="inline-block bg-teak-dark text-cream text-body-lg font-bold py-4 px-10 rounded-lg hover:bg-teak transition-colors shadow-lg min-h-[56px]"
          >
            โทร 08X-XXX-XXXX
          </a>
        </div>
      </section>
    </main>
  );
}
