import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "System-Sentinel",
  description: "Live Anomaly Detection Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-gray-900 text-gray-100">
      <body>
        {children}
      </body>
    </html>
  );
}