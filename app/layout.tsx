import type { Metadata } from "next";
import { Playfair_Display, Lato, Pattaya } from "next/font/google";
import "./globals.css";
// 1. Import your Providers and UI components
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/clients/navbar";
import { Toaster } from "sonner"; // For the pop-up notifications

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const pattaya = Pattaya({
  subsets: ["latin", "thai"],
  weight: "400",
  variable: "--font-pattaya",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dej Carving Shop",
  description: "Timeless Wood & Collectibles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} ${pattaya.variable} antialiased`}>
        {/* 2. Wrap everything with Providers */}
        <AuthProvider>
          <CartProvider>
            
            {/* Navbar is here so it appears on every page */}
            <Navbar /> 
            
            {children}
            
            {/* Toaster for notifications */}
            <Toaster position="bottom-right" /> 

          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}