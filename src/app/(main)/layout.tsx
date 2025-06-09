"use client";

import { Inter, Manrope } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getDocuments } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Device } from "@/model/Device";
import NoDevice from "@/components/NoDevice";
import Sidebar from "@/components/Sidebar";

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
  const [devices, setDevices] = useState<Device[]>([]);

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

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const result = await getDocuments<Device>("devices");
        setDevices(result);
      } catch (error) {
        console.error("❌ Gagal mengambil data perangkat:", error);
      }
    };

    fetchDevices();
  }, []);;

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
      <Toaster />
      <Navbar />
      <main className="min-h-screen bg-main py-8">
        <div className="container mx-auto mt-20 lg:mt-24 lg:mb-8">
          {devices.length !== 0
            ?
            <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
              <Sidebar />
              <div className="grow flex flex-col gap-8 w-full lg:w-fit px-2 lg:px-0">
                {children}
              </div>
            </div>
            :
            <NoDevice devices={devices} />
          }
        </div>
      </main>
    </body>
  );
}
