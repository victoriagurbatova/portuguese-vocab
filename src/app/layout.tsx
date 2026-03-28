import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Portuguese Vocab",
  description: "Flashcards for Portuguese vocabulary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">{children}</main>
      </body>
    </html>
  );
}
