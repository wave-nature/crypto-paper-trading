import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "./components/ToastContainer";
import AuthLayout from "./components/auth/AuthLayout";
export const metadata: Metadata = {
  title: "Paprweight",
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
        <AuthLayout>{children}</AuthLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
