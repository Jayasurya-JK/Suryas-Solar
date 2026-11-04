import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Surya's Solar Office",
  description: "Quotes, leads and expenses for Surya's Solar",
  robots: { index: false, follow: false },
};

export const viewport = { themeColor: "#0f4bd6" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
