"use client";

import React from "react";
import { useLocale } from "@/app/context/LocaleContext";

function ThaiFlag() {
  return (
    <svg viewBox="0 0 100 100" width="36" height="36">
      <clipPath id="th-circle">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
      <g clipPath="url(#th-circle)">
        <rect width="100" height="100" fill="#ED1C24" />
        <rect y="17" width="100" height="66" fill="#FFFFFF" />
        <rect y="33" width="100" height="34" fill="#241D4F" />
      </g>
    </svg>
  );
}

function UKFlag() {
  return (
    <svg viewBox="0 0 100 100" width="36" height="36">
      <clipPath id="uk-circle">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
      <g clipPath="url(#uk-circle)">
        <rect width="100" height="100" fill="#012169" />
        <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="12" />
        <path d="M0,0 L50,50" stroke="#C8102E" strokeWidth="8" />
        <path d="M100,0 L50,50" stroke="#C8102E" strokeWidth="8" />
        <path d="M0,100 L50,50" stroke="#C8102E" strokeWidth="8" />
        <path d="M100,100 L50,50" stroke="#C8102E" strokeWidth="8" />
        <path d="M50,0 V100 M0,50 H100" stroke="#fff" strokeWidth="16" />
        <path d="M50,0 V100 M0,50 H100" stroke="#C8102E" strokeWidth="10" />
      </g>
    </svg>
  );
}

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "th" ? "en" : "th")}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-card shadow-xl
                 border-2 border-gold-soft/40 hover:shadow-2xl active:scale-95
                 transition-all flex items-center justify-center"
      aria-label={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      title={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      {locale === "th" ? <ThaiFlag /> : <UKFlag />}
    </button>
  );
}
