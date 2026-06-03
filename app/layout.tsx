import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Kapakana } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const kapakana = Kapakana({
  variable: "--font-kapakana",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Diana Senik — Portfolio",
  description: "Portfolio of Diana Senik — developer and designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} ${kapakana.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
