import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import styles from "./connect/connect.module.css";

// Root layout for /connect only. It shares nothing with the (site) layout.
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kyle-morgan.me"),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function ConnectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} ${styles.body}`}>{children}</body>
    </html>
  );
}
