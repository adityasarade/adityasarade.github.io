import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";
import "./site.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Fragment_Mono({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adityasarade.github.io"),
  title: {
    default: "Aditya Sarade — AI Engineer",
    template: "%s — Aditya Sarade",
  },
  description:
    "AI engineer taking systems from prototype to production. Voice agents in 11 languages, an LLM gateway on npm + PyPI, a memory framework for agents. Every project ships with a number.",
  openGraph: {
    title: "Aditya Sarade — AI Engineer",
    description:
      "Prototype → production. Voice AI in 11 languages, LLM gateway + cost dashboard, agent memory framework. Shipped as packages, measured in numbers.",
    url: "https://adityasarade.github.io",
    siteName: "Aditya Sarade",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aditya Sarade — I take AI from prototype to production." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Sarade — AI Engineer",
    description:
      "Prototype → production. Voice AI in 11 languages, LLM gateway + cost dashboard, agent memory framework.",
    images: ["/og.png"],
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
      data-theme="night"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("as-theme")==="paper"){document.documentElement.dataset.theme="paper"}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}.obsPage{height:auto;overflow:visible}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
