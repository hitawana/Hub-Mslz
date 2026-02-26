import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { MapleLeavesCanvas } from "@/components/background/MapleLeavesCanvas";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const titleFont = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-title",
  display: "swap"
});

const bodyFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "NIT Portal Official",
  description: "Consolidated HERO and TOOLS sections"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased">
        <MapleLeavesCanvas />
        <div className="relative z-10">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
