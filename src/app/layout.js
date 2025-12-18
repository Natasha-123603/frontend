import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardShell from "@/components/layout/DashboardShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Airbnb · Internal Hospitality Dashboard",
  description: "Airbnb-inspired internal dashboard for teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
