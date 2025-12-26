import type { Metadata } from "next";
import "./globals.css";
import { AgeProvider } from "@/context/AgeContext";

export const metadata: Metadata = {
  title: "The 100-Year Scroll | A Timeline of Human Wisdom",
  description: "A collaborative timeline of human wisdom. Anonymous stories and life lessons from every age, 0 to 100. Share your struggles, joys, and realizations.",
  keywords: ["wisdom", "life lessons", "anonymous", "timeline", "century", "experience", "advice", "age"],
  authors: [{ name: "The 100-Year Scroll Community" }],
  openGraph: {
    title: "The 100-Year Scroll",
    description: "A collaborative timeline of human wisdom from ages 0 to 100.",
    type: "website",
    locale: "en_US",
    siteName: "The 100-Year Scroll",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 100-Year Scroll",
    description: "A collaborative timeline of human wisdom from ages 0 to 100.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen">
        <AgeProvider>
          {children}
        </AgeProvider>
      </body>
    </html>
  );
}
