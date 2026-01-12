import React from "react";
import { Hammer, Heart, TreeDeciduous, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative w-full h-[400px] bg-[#2e1d10] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        {/* Background Image (Replace with your own workshop photo) */}
        <img 
          src="https://placehold.co/1920x600/png?text=Wood+Workshop" 
          alt="Workshop" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="text-[#D4AF37] text-lg font-bold mb-3 uppercase tracking-[0.2em]">
            Since 1995
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-[#F5F5DC] mb-6 tracking-wide">
            Our Story
          </h1>
          <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto">
            We don't just sell furniture. We preserve stories carved into wood.
          </p>
        </div>
      </section>

      {/* --- 2. THE MISSION --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#4B3621] mb-6">
              More Than Just Wood
            </h2>
            <div className="h-1 w-20 bg-[#D4AF37] mb-8"></div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At <span className="font-bold text-[#4B3621]">Dej Carving Shop</span>, we believe that every piece of timber has a soul. Whether it's a reclaimed teak cabinet or a hand-carved amulet, these items carry the history of the hands that made them and the trees that grew them.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Based in the heart of Chiang Mai's artisanal community, our mission is to find these hidden treasures, restore them to their former glory, and find them a new home where they will be cherished for generations to come.
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://placehold.co/400x500/png?text=Carving+Detail" 
              className="rounded-lg shadow-xl mt-8 transform hover:-translate-y-2 transition-transform duration-500" 
              alt="Detail" 
            />
            <img 
              src="https://placehold.co/400x500/png?text=Antique+Chair" 
              className="rounded-lg shadow-xl transform hover:-translate-y-2 transition-transform duration-500" 
              alt="Chair" 
            />
          </div>
        </div>
      </section>

      {/* --- 3. OUR VALUES (Icons) --- */}
      <section className="py-20 bg-[#2e1d10] text-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#D4AF37]">Why We Do What We Do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* Value 1 */}
            <div className="p-6 border border-[#D4AF37]/20 rounded-lg bg-[#3a2515] hover:bg-[#452c1a] transition-colors">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <Hammer size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">Craftsmanship</h3>
              <p className="text-gray-300 text-sm">Honoring the traditional skills of Lanna artisans.</p>
            </div>

            {/* Value 2 */}
            <div className="p-6 border border-[#D4AF37]/20 rounded-lg bg-[#3a2515] hover:bg-[#452c1a] transition-colors">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">Timelessness</h3>
              <p className="text-gray-300 text-sm">Quality that survives the test of time and trends.</p>
            </div>

            {/* Value 3 */}
            <div className="p-6 border border-[#D4AF37]/20 rounded-lg bg-[#3a2515] hover:bg-[#452c1a] transition-colors">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <TreeDeciduous size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">Sustainability</h3>
              <p className="text-gray-300 text-sm">Giving new life to old wood and reclaimed furniture.</p>
            </div>

            {/* Value 4 */}
            <div className="p-6 border border-[#D4AF37]/20 rounded-lg bg-[#3a2515] hover:bg-[#452c1a] transition-colors">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">Passion</h3>
              <p className="text-gray-300 text-sm">Every item is handpicked with genuine love and care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. STATISTICS / TRUST --- */}
      <section className="py-20 border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-serif font-bold text-[#4B3621] mb-2">30+</h3>
            <p className="text-gray-600 uppercase tracking-widest text-sm">Years Experience</p>
          </div>
          <div>
            <h3 className="text-5xl font-serif font-bold text-[#4B3621] mb-2">500+</h3>
            <p className="text-gray-600 uppercase tracking-widest text-sm">Items Restored</p>
          </div>
          <div>
            <h3 className="text-5xl font-serif font-bold text-[#4B3621] mb-2">100%</h3>
            <p className="text-gray-600 uppercase tracking-widest text-sm">Authentic Wood</p>
          </div>
          <div>
            <h3 className="text-5xl font-serif font-bold text-[#4B3621] mb-2">Chiang Mai</h3>
            <p className="text-gray-600 uppercase tracking-widest text-sm">Based & Grown</p>
          </div>
        </div>
      </section>

      {/* --- 5. CTA SECTION --- */}
      <section className="py-24 text-center px-4 bg-[#EBE8E1]">
        <h2 className="text-3xl md:text-5xl font-serif text-[#2e1d10] mb-6">
          Find Your Next Masterpiece
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Our collection changes weekly. Come visit us at Ban Tawai or browse our online catalog.
        </p>
        <a 
          href="/"
          className="inline-block bg-[#D4AF37] hover:bg-[#b5952f] text-[#2e1d10] text-lg font-bold py-4 px-10 rounded shadow-xl transition-all active:scale-95"
        >
          Browse Collection
        </a>
      </section>

    </main>
  );
}