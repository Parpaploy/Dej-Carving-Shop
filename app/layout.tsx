import type { Metadata } from "next";
import { Castoro } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LocaleProvider } from "./context/LocaleContext";
import Navbar from "./components/clients/navbar";
import Footer from "./components/clients/footer";
import FloatingContact from "./components/ui/FloatingContact";
import LanguageToggle from "./components/ui/LanguageToggle";
import { Toaster } from "sonner";

const castoro = Castoro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-castoro",
  display: "swap",
});


export const metadata: Metadata = {
  title: "ร้านเดชแกะสลัก | Dej Carving Shop",
  description: "งานแกะสลักไม้สักแท้ จากบ้านถวาย เชียงใหม่ — Authentic teak wood carvings from Ban Tawai, Chiang Mai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${castoro.variable} antialiased`}>
        <LocaleProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <FloatingContact />
              <LanguageToggle />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    fontSize: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#F5EDE0",
                    border: "1px solid #D4B366",
                    color: "#3D2B1F",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
