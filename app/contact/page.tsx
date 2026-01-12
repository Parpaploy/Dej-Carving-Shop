"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for notifications

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  
  // Simple Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending email (Replace this with real API call later)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent! We will reply shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">

      {/* --- 1. HERO HEADER --- */}
      <section className="bg-[#2e1d10] text-[#F5F5DC] py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Get in Touch</h1>
        <p className="text-xl font-light text-gray-300 max-w-2xl mx-auto px-4">
          Have a question about a specific antique or need a custom restoration?
          We are here to help.
        </p>
      </section>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: Contact Information */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif text-[#4B3621] mb-6">Contact Information</h2>
              <div className="h-1 w-20 bg-[#D4AF37] mb-8"></div>
              <p className="text-gray-600 leading-relaxed mb-8">
                We prefer visits by appointment to ensure we can give you our full attention, but walk-ins at Ban Tawai are always welcome during business hours.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full text-[#2e1d10]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2e1d10]">Our Showroom</h3>
                  <p className="text-gray-600">
                    Ban Tawai Wood Carving Village<br />
                    Hang Dong District, Chiang Mai 50230<br />
                    Thailand
                  </p>
                </div>
              </div>

              {/* Phone / LINE */}
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full text-[#2e1d10]">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2e1d10]">Call & Chat</h3>
                  <p className="text-gray-600">08X-XXX-XXXX (Khun Dej)</p>
                  <div className="flex items-center gap-2 mt-2 text-green-600 font-bold">
                    <MessageCircle size={20} />
                    <span>Line ID: @dejcarving</span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full text-[#2e1d10]">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2e1d10]">Email Us</h3>
                  <p className="text-gray-600">support@dejcarving.com</p>
                  <p className="text-gray-600">sales@dejcarving.com</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-[#D4AF37]/20 p-3 rounded-full text-[#2e1d10]">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2e1d10]">Business Hours</h3>
                  <p className="text-gray-600">Daily: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6 border-t border-gray-200">
              <p className="font-bold text-[#2e1d10] mb-4">Follow Our Latest Finds</p>
              <div className="flex gap-4">
                <a href="#" className="bg-[#2e1d10] text-white p-3 rounded hover:bg-[#D4AF37] hover:text-[#2e1d10] transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="bg-[#2e1d10] text-white p-3 rounded hover:bg-[#D4AF37] hover:text-[#2e1d10] transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-serif text-[#4B3621] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Name</label>
                  <input 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-all"
                    placeholder="Khun Somchai"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input 
                  name="subject"
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-all"
                  placeholder="Inquiry about Teak Cabinet..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-all"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#2e1d10] text-[#D4AF37] font-bold py-4 rounded hover:bg-[#3d291a] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Sending..." : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* --- 3. GOOGLE MAP --- */}
      <section className="h-[400px] w-full bg-gray-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1889.7124041400114!2d98.9449374385011!3d18.689789995609264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3114739e5ed7%3A0x80588edbe66d9927!2sDej%20Carving%20Shop!5e0!3m2!1sth!2sth!4v1768209226485!5m2!1sth!2sth" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          title="Dej Carving Shop Location"
        ></iframe>
      </section>

      {/* --- 4. FAQ SECTION --- */}
      <section className="py-20 bg-[#EBE8E1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-center text-[#4B3621] mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <FaqItem 
              question="Do you ship internationally?" 
              answer="Yes, we work with specialized logistics partners to ship antiques safely to the USA, Europe, and Asia. Shipping costs vary by weight and volume."
            />
            <FaqItem 
              question="Are your items authentic antiques?" 
              answer="We sell a mix of genuine antiques and high-quality reclaimed wood reproductions. Each item listing explicitly states its age and origin."
            />
            <FaqItem 
              question="Can I request a custom carving?" 
              answer="Absolutely. Our master carvers can create custom pieces based on your designs or photos. Custom orders typically take 4-8 weeks."
            />
          </div>
        </div>
      </section>

    </main>
  );
}

// Simple FAQ Component
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-lg text-[#2e1d10]">{question}</span>
        <span className={`text-[#D4AF37] text-2xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
          <p className="mt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}