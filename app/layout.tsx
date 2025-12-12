import type { Metadata } from "next";
import "./globals.css";
import AuthLayout from "./components/auth/AuthLayout";
export const metadata: Metadata = {
  title: "Paprweight - #1 Crypto Paper Trading Simulator & Demo Account",
  description:
    "Master crypto trading risk-free with Paprweight. Real-time market data, advanced charting, and portfolio tracking. The best free cryptocurrency trading simulator for beginners and pros.",
  keywords: [
    "crypto paper trading",
    "crypto trading simulator",
    "crypto demo account",
    "paper trading app",
    "learn crypto trading",
    "bitcoin trading simulator",
    "virtual crypto trading",
    "risk-free crypto trading",
    "trading strategies",
    "technical analysis",
  ],
  openGraph: {
    title: "Paprweight - #1 Crypto Paper Trading Simulator",
    description:
      "Master crypto trading risk-free with Paprweight. Real-time market data and advanced charting.",
    type: "website",
    locale: "en_US",
    siteName: "Paprweight",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paprweight - Crypto Paper Trading Simulator",
    description:
      "Master crypto trading risk-free with Paprweight. The best free cryptocurrency trading simulator.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
