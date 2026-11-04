import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Surya's Solar Office",
  description: "Quotes, leads and expenses for Surya's Solar",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Suryas Office", statusBarStyle: "default" },
  icons: { apple: "/icon-192.png" },
};

export const viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
