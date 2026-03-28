import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CampaignProvider } from "@/store/CampaignStore";
import { AuthProvider } from "@/store/AuthStore";
import { ThemeProvider } from "@/store/ThemeStore";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard de Campanha - SC",
  description: "Sistema de inteligência para campanha de Deputado Estadual em SC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} text-gray-900 bg-gray-50 dark:bg-gray-900 antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <CampaignProvider>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </CampaignProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
