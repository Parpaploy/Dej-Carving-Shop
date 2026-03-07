"use client";

import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teak-dark text-cream">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Column 1: Shop Info */}
          <div>
            <h3 className="font-pattaya text-3xl text-gold-soft mb-4">
              ร้านเดชแกะสลัก
            </h3>
            <p className="text-cream/80 text-body leading-relaxed">
              งานแกะสลักไม้สักแท้ จากบ้านถวาย เชียงใหม่
            </p>
            <p className="text-cream/60 text-sm mt-2">
              Authentic teak wood carvings from Ban Tawai, Chiang Mai
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-xl text-gold-soft mb-4">
              เมนู / Menu
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/">หน้าแรก / Home</FooterLink>
              <FooterLink href="/products">สินค้า / Shop</FooterLink>
              <FooterLink href="/about">เกี่ยวกับ / About</FooterLink>
              <FooterLink href="/contact">ติดต่อ / Contact</FooterLink>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-serif text-xl text-gold-soft mb-4">
              ติดต่อเรา / Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-body">
              <a
                href="tel:08XXXXXXXX"
                className="flex items-center gap-3 text-cream/80 hover:text-gold-soft transition-colors"
              >
                <Phone size={20} className="flex-shrink-0" />
                <span>08X-XXX-XXXX</span>
              </a>
              <div className="flex items-center gap-3 text-cream/80">
                <Mail size={20} className="flex-shrink-0" />
                <span>dej.carving@email.com</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <MapPin size={20} className="flex-shrink-0" />
                <span>บ้านถวาย เชียงใหม่</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <Clock size={20} className="flex-shrink-0" />
                <span>เปิดทุกวัน 08:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-10 rounded-lg overflow-hidden border border-gold-soft/30">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3778.123!2d98.932!3d18.728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQzJzQxLjAiTiA5OMKwNTUnNTUuMiJF!5e0!3m2!1sen!2sth!4v1"
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
          <p>&copy; {new Date().getFullYear()} ร้านเดชแกะสลัก — Dej Carving Shop. All rights reserved.</p>
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
