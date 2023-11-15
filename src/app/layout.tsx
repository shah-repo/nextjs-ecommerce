import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./Footer";
import "./globals.css";
import Navbar from "./Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowmazon",
  description: "This makes your shopping easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> 
        <main className="m-auto min-w-[300px] max-w-7xl p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
