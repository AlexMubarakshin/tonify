import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import { ApplicationLayout } from "@/features/application-layout/application-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "TONify",
  title: "TONify: Tools for the TON Blockchain",
  description: "TONify offers a powerful suite of tools designed to simplify and enhance your experience with the TON blockchain.",
  openGraph: {
    type: "website",
    url: "https://tonify.io",
    title: "TONify: Tools for the TON Blockchain",
    description:
      "TONify provides easy-to-use, efficient tools for working with TON blockchain addresses and other TON features. Whether you're converting, validating, or managing TON-related data, TONify has you covered.",
  },
  keywords: [
    "TONify",
    "TON blockchain",
    "TON address converter",
    "TON address validation",
    "blockchain tools",
    "TON blockchain tools",
    "address management",
    "TON wallet",
    "TON blockchain explorer",
    "TON address utilities",
    "TONify address tools",
    "cryptocurrency address converter",
    "blockchain address tool",
    "TON crypto tools"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ApplicationLayout>
            {children}
          </ApplicationLayout>
        </Providers>
      </body>
    </html>
  );
}
