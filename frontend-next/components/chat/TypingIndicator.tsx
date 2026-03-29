'use client';

/**
 * Indicador de "el bot está escribiendo" – tres puntos animados.
 * Se muestra brevemente antes de que aparezca cada mensaje del bot.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3 my-2">
      {/* Avatar del bot */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
        AI
      </div>
      {/* Burbuja con puntos */}
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
