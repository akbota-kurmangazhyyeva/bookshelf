// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from '@/components/SessionWrapper';
import Navbar from '../components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}