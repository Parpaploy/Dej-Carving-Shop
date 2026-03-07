"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
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
    toast.success("ส่งข้อความแล้ว! เราจะตอบกลับเร็วๆนี้ / Message sent!");
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
        <h1 className="text-h1 md:text-display font-serif font-bold mb-4">ติดต่อเรา</h1>
        <p className="text-body-lg text-cream/80 max-w-2xl mx-auto px-4">
          Contact Us — สอบถามเกี่ยวกับสินค้า หรือต้องการงานสั่งทำพิเศษ
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* LEFT: Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-h3 font-serif text-teak-dark mb-4">ข้อมูลการติดต่อ</h2>
              <p className="text-body text-text-muted mb-1">Contact Information</p>
              <div className="h-1 w-20 bg-gold mb-6" />
              <p className="text-body text-text-muted leading-relaxed">
                เรายินดีต้อนรับทุกท่าน ทั้งนัดหมายล่วงหน้าหรือ walk-in ที่บ้านถวาย
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">โชว์รูม / Showroom</h3>
                  <p className="text-text-muted">
                    หมู่บ้านถวาย อ.หางดง เชียงใหม่ 50230<br />
                    Ban Tawai, Hang Dong, Chiang Mai
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">โทรศัพท์ / Phone</h3>
                  <a href="tel:08XXXXXXXX" className="text-text-muted hover:text-gold transition-colors">
                    08X-XXX-XXXX (คุณเดช)
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
                  <h3 className="font-bold text-body text-teak-dark">อีเมล / Email</h3>
                  <p className="text-text-muted">dej.carving@email.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-body text-teak-dark">เวลาเปิด-ปิด / Hours</h3>
                  <p className="text-text-muted">เปิดทุกวัน 08:00 - 18:00</p>
                  <p className="text-text-muted text-sm">Open Daily</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="pt-6 border-t border-cream-alt">
              <p className="font-bold text-teak-dark mb-4">ติดตามเรา / Follow Us</p>
              <div className="flex gap-4">
                <a href="#" className="bg-teak text-cream p-3 rounded-lg hover:bg-gold transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-card p-8 rounded-xl shadow-xl border border-gold-soft/20">
            <h2 className="text-h4 font-serif text-teak-dark mb-6">ส่งข้อความถึงเรา</h2>
            <p className="text-sm text-text-muted mb-6">Send us a Message</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-body font-bold text-teak-dark">ชื่อ / Name</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                    placeholder="คุณสมชาย"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body font-bold text-teak-dark">อีเมล / Email</label>
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
                <label className="text-body font-bold text-teak-dark">เรื่อง / Subject</label>
                <input
                  name="subject"
                  required
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                  placeholder="สอบถามเกี่ยวกับตู้ไม้สัก..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-body font-bold text-teak-dark">ข้อความ / Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream border border-cream-alt rounded-lg focus:ring-2 focus:ring-gold focus:outline-none transition-all text-body"
                  placeholder="สนใจสินค้าชิ้นไหน? มีอะไรให้ช่วยครับ?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teak text-cream font-bold py-4 rounded-lg hover:bg-teak-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-body-lg min-h-[56px]"
              >
                {loading ? "กำลังส่ง..." : (
                  <>ส่งข้อความ / Send <Send size={18} /></>
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
          <h2 className="text-h2 font-serif text-center text-teak-dark mb-4">คำถามที่พบบ่อย</h2>
          <p className="text-body text-text-muted text-center mb-12">Frequently Asked Questions</p>

          <div className="space-y-4">
            <FaqItem
              question="จัดส่งต่างประเทศได้ไหม? / Do you ship internationally?"
              answer="ได้ครับ เรามีพาร์ทเนอร์จัดส่งสำหรับสินค้าขนาดใหญ่ไปทั่วโลก ค่าส่งขึ้นอยู่กับน้ำหนักและขนาด / Yes, we work with specialized logistics partners for safe international shipping."
            />
            <FaqItem
              question="สินค้าเป็นของแท้ไหม? / Are items authentic?"
              answer="เราขายทั้งของเก่าแท้และงานจำลองจากไม้เก่าคุณภาพสูง ทุกรายการระบุอายุและแหล่งที่มาชัดเจน / Each listing explicitly states its age and origin."
            />
            <FaqItem
              question="รับสั่งทำพิเศษไหม? / Custom carvings?"
              answer="ได้ครับ ช่างแกะสลักของเราสามารถสร้างงานตามแบบของคุณได้ ใช้เวลาประมาณ 4-8 สัปดาห์ / Custom orders typically take 4-8 weeks."
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
