import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jam Project",
  description: "Youtube Queue Player",
  generator: "Varun",
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

