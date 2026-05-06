import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Be_Vietnam_Pro({
  variable: "--font-geist-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
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
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicSiteCarsProvider>{children}</PublicSiteCarsProvider>
      </body>
    </html>
  );
}
