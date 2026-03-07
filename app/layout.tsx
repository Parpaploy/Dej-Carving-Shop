import type { Metadata } from "next";
import { Playfair_Display, Sarabun, Pattaya } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/clients/navbar";
import Footer from "./components/clients/footer";
import FloatingContact from "./components/ui/FloatingContact";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

const pattaya = Pattaya({
  subsets: ["latin", "thai"],
  weight: "400",
  variable: "--font-pattaya",
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
      <body className={`${playfair.variable} ${sarabun.variable} ${pattaya.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingContact />
            <Toaster
              position="bottom-left"
              toastOptions={{
                style: {
                  fontSize: "1rem",
                  padding: "1rem 1.25rem",
                  background: "#FEFCF8",
                  border: "1px solid #C4A265",
                  color: "#2C1810",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
