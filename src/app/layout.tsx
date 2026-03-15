import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "SeDiscipulo | Tienda de ropa cristiana",
  description: "Diseños alineados a la verdad bíblica con calidad premium",
  icons: {
    icon: "/logo_sediscipulo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${plusJakarta?.variable || ''} ${outfit?.variable || ''} ${cormorant?.variable || ''} ${ibmPlex?.variable || ''} antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
