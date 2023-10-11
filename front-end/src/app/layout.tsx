"use client";

import Nav from "@/components/LandingPage/Nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Taviraj } from "next/font/google";
import dynamic from "next/dynamic";

// const Nav = dynamic(() => import("@/components/LandingPage/Nav"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

const taviraj = Taviraj({
  weight: ["200", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={taviraj.className}>
        <div>
          <Nav />
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
