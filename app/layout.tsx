import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Mono, DM_Sans, Kapakana } from "next/font/google";
import Script from "next/script";
import CustomCursor from "@/components/CustomCursor";
import ResetScrollOnLoad from "@/components/ResetScrollOnLoad";
import "./globals.css";

const SCROLL_RESET_ON_RELOAD = `
(function () {
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (e) {}
  var nav = performance.getEntriesByType("navigation")[0];
  if (nav && nav.type === "reload") {
    window.scrollTo(0, 0);
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }
})();
`;

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const kapakana = Kapakana({
  variable: "--font-kapakana",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Diana Senik — Portfolio",
  description: "Portfolio of Diana Senik — developer and designer.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
      <body className="flex min-h-full flex-col font-sans">
        <Script
          id="scroll-reset-on-reload"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: SCROLL_RESET_ON_RELOAD }}
        />
        <ResetScrollOnLoad />
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
