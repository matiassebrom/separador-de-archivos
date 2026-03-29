/**
 * layout.tsx – Server Component (NO tiene 'use client')
 *
 * MIGRACIÓN: equivale al app.config.ts + index.html de Angular.
 *
 * Es el punto de entrada de la app. Acá:
 *   - Se configuran metadatos (título, descripción)
 *   - Se elige la fuente
 *   - Se envuelve todo en AppStateProvider (el "proveedor global" de estado)
 *
 * AppStateProvider es un Client Component, pero puede ser importado y renderizado
 * desde un Server Component sin problema. Next.js sabe qué corre en el servidor
 * y qué en el browser según el 'use client' en cada archivo.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split & Filter Excel",
  description: "Dividí y filtrá archivos Excel fácilmente, paso a paso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-gray-100 min-h-screen`}>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
