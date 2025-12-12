"use client";

import Navbar from "../components/Navbar";
import ToastContainer from "../components/ToastContainer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <ToastContainer />
    </>
  );
}
