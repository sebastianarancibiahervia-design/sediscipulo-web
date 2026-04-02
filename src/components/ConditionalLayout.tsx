"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartProvider } from "./CartProvider";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  // home-preview tiene hero full-screen que maneja su propio espaciado interno
  const isFullScreenHero = pathname === "/home-preview";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className={`min-h-screen font-sans ${isFullScreenHero ? "" : "pt-20"}`}>
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}

