"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-cream z-50">
      <Loader2 className="w-16 h-16 text-gold animate-spin mb-4" />
      <h2 className="text-h4 font-serif text-teak-dark font-bold animate-pulse">
        กำลังโหลด...
      </h2>
      <p className="text-text-muted mt-2">Loading Collection</p>
    </div>
  );
}
