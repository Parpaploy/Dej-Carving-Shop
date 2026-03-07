import React from "react";
import Link from "next/link";
import { Hammer, Heart, TreeDeciduous, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-cream text-text-main">

      {/* HERO */}
      <section className="relative w-full min-h-[400px] bg-teak-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <img
          src="https://placehold.co/1920x600/png?text=Wood+Workshop"
          alt="Workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-16">
          <p className="text-gold-soft text-body font-semibold mb-3 tracking-[0.2em] uppercase">
            ตั้งแต่ปี พ.ศ. 2538 / Since 1995
          </p>
          <h1 className="text-h1 md:text-display font-serif text-cream mb-6">
            เรื่องราวของเรา
          </h1>
          <p className="text-body-lg text-cream/80 max-w-2xl mx-auto">
            Our Story — เราไม่ได้แค่ขายเฟอร์นิเจอร์ เราอนุรักษ์เรื่องราวที่สลักไว้ในเนื้อไม้
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-h2 font-serif text-teak-dark mb-6">มากกว่าแค่ไม้สัก</h2>
            <p className="text-body text-text-muted mb-2">More Than Just Wood</p>
            <div className="h-1 w-20 bg-gold mb-8" />
            <p className="text-body text-text-main leading-relaxed mb-6">
              ที่ <span className="font-bold text-teak-dark">ร้านเดชแกะสลัก</span> เราเชื่อว่าไม้ทุกชิ้นมีจิตวิญญาณ ไม่ว่าจะเป็นตู้ไม้สักเก่า หรืองานแกะสลักด้วยมือ แต่ละชิ้นล้วนบอกเล่าเรื่องราวของช่างฝีมือที่สร้างสรรค์มันขึ้นมา
            </p>
            <p className="text-body text-text-main leading-relaxed">
              At <span className="font-bold text-teak-dark">Dej Carving Shop</span>, we believe every piece of timber has a soul. Based in Chiang Mai&#39;s artisanal community, our mission is to find hidden treasures, restore them, and find them a new home.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://placehold.co/400x500/png?text=Carving+Detail"
              className="rounded-xl shadow-xl mt-8 hover:-translate-y-1 transition-transform duration-500"
              alt="Carving detail"
            />
            <img
              src="https://placehold.co/400x500/png?text=Antique+Cabinet"
              className="rounded-xl shadow-xl hover:-translate-y-1 transition-transform duration-500"
              alt="Antique cabinet"
            />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-teak-dark text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-serif text-gold-soft">ทำไมเราถึงรักงานนี้</h2>
            <p className="text-body text-cream/60 mt-2">Why We Do What We Do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Hammer size={32} />, title: "ฝีมือช่าง", sub: "Craftsmanship", desc: "สืบสานทักษะช่างล้านนาดั้งเดิม" },
              { icon: <Clock size={32} />, title: "ความเป็นอมตะ", sub: "Timelessness", desc: "คุณภาพที่ทนทานผ่านกาลเวลา" },
              { icon: <TreeDeciduous size={32} />, title: "ยั่งยืน", sub: "Sustainability", desc: "ให้ชีวิตใหม่แก่ไม้เก่าอันทรงคุณค่า" },
              { icon: <Heart size={32} />, title: "ความหลงใหล", sub: "Passion", desc: "ทุกชิ้นคัดสรรมาด้วยใจรัก" },
            ].map((v) => (
              <div key={v.sub} className="p-6 border border-gold-soft/20 rounded-xl bg-teak-light/20 hover:bg-teak-light/30 transition-colors">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-soft">
                  {v.icon}
                </div>
                <h3 className="text-h5 font-bold mb-1 font-serif">{v.title}</h3>
                <p className="text-sm text-gold-soft mb-2">{v.sub}</p>
                <p className="text-cream/70 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-20 border-b border-gold-soft/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "30+", label: "ปีประสบการณ์ / Years" },
            { num: "500+", label: "ชิ้นงาน / Items Crafted" },
            { num: "100%", label: "ไม้สักแท้ / Authentic" },
            { num: "เชียงใหม่", label: "บ้านถวาย / Ban Tawai" },
          ].map((s) => (
            <div key={s.label}>
              <h3 className="text-h2 font-serif font-bold text-teak-dark mb-2">{s.num}</h3>
              <p className="text-text-muted text-sm uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6 bg-cream-alt">
        <h2 className="text-h2 font-serif text-teak-dark mb-6">ค้นหาชิ้นงานที่ใช่</h2>
        <p className="text-body-lg text-text-muted mb-8 max-w-2xl mx-auto">
          สินค้าของเราเปลี่ยนทุกสัปดาห์ แวะมาเยี่ยมชมที่บ้านถวาย หรือดูออนไลน์ได้เลย
        </p>
        <p className="text-body text-text-muted mb-8">
          Our collection changes weekly — visit us at Ban Tawai or browse online.
        </p>
        <Link
          href="/products"
          className="inline-block bg-gold hover:bg-gold-hover text-cream text-body-lg font-bold py-4 px-10 rounded-lg shadow-xl transition-all active:scale-95 min-h-[56px]"
        >
          ดูสินค้าทั้งหมด / Browse Collection
        </Link>
      </section>
    </main>
  );
}
