import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { env } from "@/config/env";
import { messages } from "@/config/messages.fa";
import { ToastProvider } from "@/components/ui/Toast";
import { MuiProvider } from "@/components/ui/MuiProvider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: messages["meta.title"],
  description: messages["meta.description"],
  openGraph: {
    title: messages["meta.title"],
    description: messages["meta.description"],
    siteName: messages["brand.name"],
    locale: "fa_IR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: messages["meta.title"] }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <MuiProvider>
          <ToastProvider>
            <Header />
            {children}
            <Footer />
          </ToastProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
