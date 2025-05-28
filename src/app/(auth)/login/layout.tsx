import "../../globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

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
      <main className="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:bg-radial-[at_50%_75%] lg:from-emerald-200 lg:via-sky-200 lg:to-[#d7d9db] lg:to-90%">
        {children}
      </main>
    </body>
  );
}
