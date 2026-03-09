"use client";

import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/app/context/LocaleContext";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-card rounded-xl shadow-2xl border border-gold-soft/40 p-5 mb-2 w-64"
          >
            <p className="font-serif text-lg text-teak-dark font-bold mb-3">
              {t("float.contactTitle")}
            </p>

            {/* Phone */}
            <a
              href="tel:092-3640013"
              className="flex items-center gap-3 text-text-main hover:text-gold transition-colors py-2"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-semibold">{t("float.callUs")}</p>
                <p className="text-sm text-text-muted">{t("common.phone")}</p>
              </div>
            </a>

            {/* LINE */}
            <a
              href="https://line.me/ti/p/YOUR_LINE_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-text-main hover:text-[#06C755] transition-colors py-2"
            >
              <div className="w-10 h-10 bg-[#06C755]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-[#06C755]" />
              </div>
              <div>
                <p className="font-semibold">LINE</p>
                <p className="text-sm text-text-muted">@dejcarving</p>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gold text-cream shadow-xl hover:bg-gold-hover active:scale-95 transition-all flex items-center justify-center"
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
      >
        {isOpen ? <X size={26} /> : <Phone size={26} />}
      </button>
    </div>
  );
}
