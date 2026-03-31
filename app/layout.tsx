import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "@/lib/convex-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LigaKids - Gestión de Ligas de Fútbol Infantil",
  description: "Plataforma moderna para gestionar ligas de fútbol infantil",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LigaKids",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-bg-primary">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
