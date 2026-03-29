/**
 * page.tsx – Server Component (NO tiene 'use client')
 *
 * MIGRACIÓN: equivale al bootstrapApplication() de Angular.
 *
 * Este es el punto de entrada de la ruta "/" (la única ruta de la app).
 * Es un Server Component, pero inmediatamente renderiza ChatPage que es Client Component.
 * El header fijo y el layout de pantalla completa viven acá.
 */

import { ChatPage } from "@/components/chat/ChatPage";
import { FileSpreadsheet } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header fijo */}
      <header className="bg-white border-b border-gray-200 px-5 py-3.5 shadow-sm shrink-0 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
          <FileSpreadsheet size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-tight">Split & Filter Excel</h1>
          <p className="text-xs text-gray-400">Asistente para dividir archivos Excel</p>
        </div>
      </header>

      {/* Chat ocupa el resto de la pantalla */}
      <ChatPage />
    </main>
  );
}
