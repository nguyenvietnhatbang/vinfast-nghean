import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VinFast Nghệ An - Đại lý ủy quyền VinFast chính thức tại Nghệ An",
  description: "VinFast Nghệ An - Cung cấp các dòng xe điện VinFast chính hãng: VF 3, VF 5, VF 6, VF 7, VF 8, VF 9. Dịch vụ bảo hành, bảo dưỡng chuyên nghiệp.",
};

import { PublicSiteCarsProvider } from "@/components/public/public-site-cars-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicSiteCarsProvider>{children}</PublicSiteCarsProvider>
      </body>
    </html>
  );
}
