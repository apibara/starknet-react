import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Companion Starknet React",
  description: "Application for funding and deploying arcade accounts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
