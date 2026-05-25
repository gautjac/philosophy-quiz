import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sophia — A Daily Philosophy Quiz",
  description:
    "Learn the canon of Western philosophy one thinker at a time. Read a passage, guess the philosopher and school — or work in takeaway mode with the great ideas in plain language.",
  applicationName: "Sophia",
  appleWebApp: {
    // When the user adds the page to their iPhone home screen, this opens
    // the site as a standalone web app (no Safari chrome) titled "Sophia".
    capable: true,
    title: "Sophia",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    // Stop iOS Safari from auto-linking phone-number-shaped strings.
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#2c241b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vellum">{children}</body>
    </html>
  );
}
