import "../../globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "SIMPONI | Masuk",
  description: "Sistem Monitoring Indoor Hidroponik",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={`${inter.variable} ${manrope.variable} antialiased`}>
      <main className="grid grid-cols-2 min-h-screen">
        {children}
      </main>
    </body>
  );
}
