import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alejandro De La Mora - AI Solutions Architect & Engineer",
  description: "Professional resume of Alejandro De La Mora, AI Solutions Architect specialized in GenAI and automation",
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
