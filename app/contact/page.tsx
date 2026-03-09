"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/app/context/LocaleContext";

export default function ContactPage() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(t("contact.sent"));
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="w-full min-h-screen bg-cream text-text-main">

      {/* HERO */}
      <section className="bg-teak-dark text-cream py-16 text-center">
        <h1 className="text-h1 md:text-display font-serif font-bold mb-4">{t("contact.heroTitle")}</h1>
        <p className="text-body-lg text-cream/80 max-w-2xl mx-auto px-4">
          {t("contact.heroSub")}
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* LEFT: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-h3 font-serif text-teak-dark mb-4">{t("contact.infoTitle")}</h2>
              <p className="text-body text-text-muted mb-1">{t("contact.infoSub")}</p>
              <div className="h-1 w-20 bg-gold mb-6" />
              <p className="text-body text-text-muted leading-relaxed">
                {t("contact.welcomeMsg")}
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">{t("contact.showroom")}</h3>
                  <p className="text-text-muted">
                    {t("contact.showroomAddress")}<br />
                    {t("contact.showroomAddressEn")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">{t("contact.phoneTitle")}</h3>
                  <a href="tel:092-3640013" className="text-text-muted hover:text-gold transition-colors">
                    {t("common.phone")} (คุณเดช)
                  </a>
                  <div className="flex items-center gap-2 mt-2 text-[#06C755] font-bold">
                    <MessageCircle size={20} />
                    <span>LINE: @dejcarving</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">{t("contact.emailTitle")}</h3>
                  <p className="text-text-muted">{t("common.email")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">{t("contact.hoursTitle")}</h3>
                  <p className="text-text-muted">{t("common.openHours")}</p>
                  <p className="text-text-muted text-sm">{t("common.openHoursSub")}</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="pt-6 border-t border-cream-alt">
              <p className="font-bold text-teak-dark mb-4">{t("contact.followUs")}</p>
              <div className="flex gap-4">
                <a href="#" className="bg-teak text-cream p-3 rounded-lg hover:bg-gold transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-card p-8 rounded-xl shadow-xl border border-gold-soft/20">
            <h2 className="text-h4 font-serif text-teak-dark mb-6">{t("contact.formTitle")}</h2>
            <p className="text-sm text-text-muted mb-6">{t("contact.formSub")}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-body font-bold text-teak-dark">{t("contact.nameLabel")}</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                    placeholder={t("contact.namePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body font-bold text-teak-dark">{t("contact.emailLabel")}</label>
                  <input
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-body font-bold text-teak-dark">{t("contact.subjectLabel")}</label>
                <input
                  name="subject"
                  required
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-body font-bold text-teak-dark">{t("contact.messageLabel")}</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teak text-cream font-bold py-4 rounded-lg hover:bg-teak-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-body-lg min-h-[56px]"
              >
                {loading ? t("contact.sending") : (
                  <>{t("contact.send")} <Send size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="h-[400px] w-full bg-cream-alt">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1889.7124041400114!2d98.9449374385011!3d18.689789995609264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3114739e5ed7%3A0x80588edbe66d9927!2sDej%20Carving%20Shop!5e0!3m2!1sth!2sth!4v1768209226485!5m2!1sth!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          title="Dej Carving Shop Location"
        />
      </section>

      {/* FAQ */}
      <section className="py-20 bg-cream-alt">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-h2 font-serif text-center text-teak-dark mb-4">{t("contact.faqTitle")}</h2>
          <p className="text-body text-text-muted text-center mb-12">{t("contact.faqSub")}</p>

          <div className="space-y-4">
            <FaqItem
              question={t("contact.faq1q")}
              answer={t("contact.faq1a")}
            />
            <FaqItem
              question={t("contact.faq2q")}
              answer={t("contact.faq2a")}
            />
            <FaqItem
              question={t("contact.faq3q")}
              answer={t("contact.faq3a")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-gold-soft/20 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-cream transition-colors"
      >
        <span className="font-bold text-body text-teak-dark pr-4">{question}</span>
        <span className={`text-gold text-2xl transition-transform flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-text-muted border-t border-cream-alt">
          <p className="mt-4 text-body leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
