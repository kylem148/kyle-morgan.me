import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kyle Morgan — Software Engineer",
  description:
    "Kyle Morgan — software engineer at Cal Poly SLO. Building digital solutions: immersive web experiences to large-scale agentic systems.",
  openGraph: {
    title: "Kyle Morgan — Software Engineer",
    description:
      "Software engineer at Cal Poly SLO. Building digital solutions from immersive web experiences to large-scale agentic systems.",
    url: "https://kyle-morgan.me",
    siteName: "Kyle Morgan",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2efe8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
