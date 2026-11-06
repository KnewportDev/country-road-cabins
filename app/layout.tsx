import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Country Road Cabins | A little closer to the wild",
  description:
    "Explore secluded cabins, treehouses and glamping stays near New River Gorge in Hico, West Virginia. An independent homepage design concept.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
