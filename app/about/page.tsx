"use client";

import React from "react";
import Link from "next/link";
import { Hammer, Heart, TreeDeciduous, Clock } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

export default function AboutPage() {
  const { t } = useLocale();

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
            {t("about.since")}
          </p>
          <h1 className="text-h1 md:text-display font-serif text-cream mb-6">
            {t("about.heroTitle")}
          </h1>
          <p className="text-body-lg text-cream/80 max-w-2xl mx-auto">
            {t("about.heroSub")}
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-h2 font-serif text-teak-dark mb-6">{t("about.missionTitle")}</h2>
            <p className="text-body text-text-muted mb-2">{t("about.missionSub")}</p>
            <div className="h-1 w-20 bg-gold mb-8" />
            <p className="text-body text-text-main leading-relaxed mb-6">{t("about.missionP1")}</p>
            <p className="text-body text-text-main leading-relaxed">{t("about.missionP2")}</p>
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
            <h2 className="text-h2 font-serif text-gold-soft">{t("about.valuesTitle")}</h2>
            <p className="text-body text-cream/60 mt-2">{t("about.valuesSub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Hammer size={32} />, title: t("about.craftsmanship"), sub: t("about.craftsmanshipSub"), desc: t("about.craftsmanshipDesc") },
              { icon: <Clock size={32} />, title: t("about.timelessness"), sub: t("about.timelessnessSub"), desc: t("about.timelessnessDesc") },
              { icon: <TreeDeciduous size={32} />, title: t("about.sustainability"), sub: t("about.sustainabilitySub"), desc: t("about.sustainabilityDesc") },
              { icon: <Heart size={32} />, title: t("about.passion"), sub: t("about.passionSub"), desc: t("about.passionDesc") },
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

      {/* CRAFTSMAN PROCESS */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-serif text-teak-dark mb-4">{t("craftsman.title")}</h2>
            <p className="text-body text-text-muted">{t("craftsman.subtitle")}</p>
            <div className="h-1 w-20 bg-gold mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, icon: "🪵", titleKey: "craftsman.step1.title" as const, descKey: "craftsman.step1.desc" as const },
              { step: 2, icon: "✏️", titleKey: "craftsman.step2.title" as const, descKey: "craftsman.step2.desc" as const },
              { step: 3, icon: "🔨", titleKey: "craftsman.step3.title" as const, descKey: "craftsman.step3.desc" as const },
              { step: 4, icon: "✨", titleKey: "craftsman.step4.title" as const, descKey: "craftsman.step4.desc" as const },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gold/20" />
                )}
                <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-gold/20 flex items-center justify-center text-4xl mb-6 shadow-md group-hover:border-gold group-hover:shadow-lg transition-all duration-300 relative z-10">
                  {item.icon}
                </div>
                <div className="w-8 h-8 mx-auto -mt-9 mb-3 rounded-full bg-gold text-white text-sm font-bold flex items-center justify-center relative z-20 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-h5 font-serif font-bold text-teak-dark mb-3 mt-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-[250px] mx-auto">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-20 border-b border-gold-soft/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "30+", label: t("about.statYears") },
            { num: "500+", label: t("about.statItems") },
            { num: "100%", label: t("about.statAuthentic") },
            { num: t("common.banTawai"), label: t("about.statLocation") },
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
        <h2 className="text-h2 font-serif text-teak-dark mb-6">{t("about.ctaTitle")}</h2>
        <p className="text-body-lg text-text-muted mb-8 max-w-2xl mx-auto">
          {t("about.ctaP1")}
        </p>
        <p className="text-body text-text-muted mb-8">
          {t("about.ctaP2")}
        </p>
        <Link
          href="/products"
          className="inline-block bg-gold hover:bg-gold-hover text-cream text-body-lg font-bold py-4 px-10 rounded-lg shadow-xl transition-all active:scale-95 min-h-[56px]"
        >
          {t("home.browseCollection")}
        </Link>
      </section>
    </main>
  );
}
