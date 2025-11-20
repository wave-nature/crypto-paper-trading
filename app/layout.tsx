import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "./components/ToastContainer";
export const metadata: Metadata = {
  title: "Paper Trading",
  description: "A simple paper trading app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
