import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIMPONI",
  description: "Sistem Monitoring Hidroponik Indoor",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {children}
    </html>
  );
}
