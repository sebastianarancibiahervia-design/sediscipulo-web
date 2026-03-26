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

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen pt-20 font-sans">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
