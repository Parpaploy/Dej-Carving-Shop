"use client";

import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { useLocale } from "@/app/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="bg-teak-dark text-cream">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Column 1: Shop Info */}
          <div>
            <h3 className="font-castoro text-3xl text-gold-soft mb-4">
              {t("common.shopName")}
            </h3>
            <p className="text-cream/80 text-body leading-relaxed">
              {t("common.shopTagline")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-xl text-gold-soft mb-4">
              {t("footer.menu")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/">{t("nav.home")}</FooterLink>
              <FooterLink href="/products">{t("nav.products")}</FooterLink>
              <FooterLink href="/about">{t("nav.about")}</FooterLink>
              <FooterLink href="/contact">{t("nav.contact")}</FooterLink>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-serif text-xl text-gold-soft mb-4">
              {t("footer.contactUs")}
            </h4>
            <div className="flex flex-col gap-3 text-body">
              <a
                href="tel:092-3640013"
                className="flex items-center gap-3 text-cream/80 hover:text-gold-soft transition-colors"
              >
                <Phone size={20} className="flex-shrink-0" />
                <span>{t("common.phone")}</span>
              </a>
              <div className="flex items-center gap-3 text-cream/80">
                <Mail size={20} className="flex-shrink-0" />
                <span>{t("common.email")}</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <MapPin size={20} className="flex-shrink-0" />
                <span>{t("common.banTawai")}</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <Clock size={20} className="flex-shrink-0" />
                <span>{t("common.openHours")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-10 rounded-lg overflow-hidden border border-gold-soft/30">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1889.7124041400114!2d98.9449374385011!3d18.689789995609264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3114739e5ed7%3A0x80588edbe66d9927!2sDej%20Carving%20Shop!5e0!3m2!1sth!2sth!4v1768209226485!5m2!1sth!2sth"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dej Carving Shop location"
          />
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cream/20 text-center text-cream/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {t("common.shopName")}. {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-cream/80 hover:text-gold-soft transition-colors text-body"
    >
      {children}
    </Link>
  );
}
