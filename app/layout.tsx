import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact Form Demo",
  description: "A contact form component with validation",
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
