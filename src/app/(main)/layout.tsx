"use client";

import { Inter, Manrope } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/masuk");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <main className="bg-main py-8">
          <div className="container mx-auto min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
          </div>
        </main>
      </body>
    );
  }

  return (
    <body className={`${inter.variable} ${manrope.variable} antialiased`}>
      <Toaster/>
      <Navbar />
      {children}
    </body>
  );
}
