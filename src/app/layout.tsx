import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AgeProvider } from "@/context/AgeContext";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The 100-Year Scroll | A Timeline of Human Wisdom",
  description: "A collaborative timeline of human wisdom. Anonymous stories from every age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <div className="noise-bg" />
        <AgeProvider>
          {children}
        </AgeProvider>
      </body>
    </html>
  );
}
