import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "SIMPONI",
  description: "Sistem Monitoring Indoor Hidroponik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={`${inter.variable} ${manrope.variable} antialiased`}>
      <Navbar/>
      {children}
    </body>
  );
}
