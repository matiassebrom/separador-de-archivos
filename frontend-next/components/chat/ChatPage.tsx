'use client';

/**
 * MIGRACIÓN: orquestador principal
 *
 * Angular:  app.component.ts con StepStore, currentStep, nextStep()
 * React:    lista de mensajes (messages[]) + activeWidgetId
 *
 * En vez de incrementar un índice de paso, appendMessage() agrega mensajes al chat.
 * Cada paso se convierte en:
 *   1. Burbuja del usuario con el resumen de lo que eligió
 *   2. Nueva burbuja del bot con el siguiente widget
 *
 * El efecto "typing" usa setTimeout + isTyping state para simular que el bot escribe.
 *
 * useCallback: memoiza funciones para que no se recreen en cada render.
 *   Equivale a los métodos de un componente Angular (que tampoco se recrean).
 */

import { useState, useCallback } from 'react';
import { ChatMessage, ExcelRow, FilterConfig } from '@/lib/types';
import { useAppStateContext } from '@/context/AppStateContext';
import { ChatWindow } from './ChatWindow';
import { RefreshCw } from 'lucide-react';

// Mensaje inicial del bot al cargar la app
const WELCOME_MESSAGE: ChatMessage = {
  id: 'bot-welcome',
  role: 'bot',
  text: '¡Hola! Soy tu asistente para dividir archivos Excel. Para empezar, arrastrá o seleccioná tu archivo .xlsx.',
  widget: 'file-drop',
};

// Delay en ms antes de que el bot "responda" (efecto typing)
const BOT_DELAY = 600;

export function ChatPage() {
  const { dispatch } = useAppStateContext();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>('bot-welcome');
  const [isTyping, setIsTyping] = useState(false);

  // Genera un ID único para cada mensaje
  const genId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Agrega un mensaje del usuario inmediatamente
  const addUserMessage = useCallback((text: string) => {
    const msg: ChatMessage = { id: genId(), role: 'user', text };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  }, []);

  // Agrega un mensaje del bot con delay (efecto typing)
  const addBotMessage = useCallback(
    (text: string, widget?: ChatMessage['widget']): Promise<string> => {
      return new Promise((resolve) => {
        setIsTyping(true);
        setActiveWidgetId(null); // deshabilita el widget anterior mientras el bot "escribe"
        setTimeout(() => {
          const id = genId();
          const msg: ChatMessage = { id, role: 'bot', text, widget };
          setMessages((prev) => [...prev, msg]);
          setIsTyping(false);
          if (widget) setActiveWidgetId(id);
          resolve(id);
        }, BOT_DELAY);
      });
    },
    []
  );

  // ─── Paso 1: archivo subido ─────────────────────────────────────────────────
  const handleFileLoaded = useCallback(
    async ({ headers, rows, filename }: { headers: string[]; rows: ExcelRow[]; filename: string }) => {
      dispatch({ type: 'SET_FILE_DATA', payload: { rows, headers, filename } });

      addUserMessage(`Subí: ${filename} (${rows.length.toLocaleString()} filas, ${headers.length} columnas)`);

      const hasOrigen = headers.includes('ORIGEN');
      await addBotMessage(
        `¡Perfecto! Leí ${rows.length.toLocaleString()} filas y ${headers.length} columnas. ` +
        (hasOrigen
          ? `Por defecto voy a separar por "ORIGEN". Podés confirmarlo o elegir otra columna.`
          : `¿Por cuál columna querés separar los archivos? Cada valor único de esa columna generará un archivo Excel separado.`),
        'column-selector'
      );
    },
    [dispatch, addUserMessage, addBotMessage]
  );

  // ─── Paso 2: columna de separación elegida ──────────────────────────────────
  const handleColumnChosen = useCallback(
    async (col: string) => {
      dispatch({ type: 'SET_SEPARATE_BY', payload: col });

      addUserMessage(`Separar por: "${col}"`);

      await addBotMessage(
        `Genial, voy a separar por la columna "${col}". ¿Querés filtrar las filas antes de separar? Por defecto está seleccionada la columna "Q_TerminateFlag". Este paso es opcional.`,
        'filter-config'
      );
    },
    [dispatch, addUserMessage, addBotMessage]
  );

  // ─── Paso 3: filtro configurado (o salteado) ────────────────────────────────
  const handleFilterChosen = useCallback(
    async (filter: FilterConfig | null) => {
      dispatch({ type: 'SET_FILTER', payload: filter });

      const userText = filter
        ? `Filtro: ${filter.header} = ${filter.values.join(', ')}`
        : 'Sin filtro (usar todas las filas)';
      addUserMessage(userText);

      await addBotMessage(
        '¿Qué columnas querés que aparezcan en los archivos generados? Por defecto están marcadas ORIGEN, ID y Q_TerminateFlag. Podés agregar o quitar las que necesitás.',
        'column-checklist'
      );
    },
    [dispatch, addUserMessage, addBotMessage]
  );

  // ─── Paso 4: columnas elegidas ──────────────────────────────────────────────
  const handleColumnsChosen = useCallback(
    async (cols: string[]) => {
      dispatch({ type: 'SET_KEEP_COLS', payload: cols });

      addUserMessage(`Columnas: ${cols.length === 1 ? cols[0] : `${cols.length} seleccionadas`}`);

      await addBotMessage(
        '¡Todo listo! Revisá el nombre base para los archivos y hacé clic en "Generar y descargar ZIP" cuando estés listo.',
        'download'
      );
    },
    [dispatch, addUserMessage, addBotMessage]
  );

  // ─── Paso 5: descarga completada ────────────────────────────────────────────
  const handleDownloadComplete = useCallback(async () => {
    setActiveWidgetId(null); // bloquea el widget de descarga

    await addBotMessage(
      '¡Listo! Tu ZIP fue generado y descargado. ¿Querés procesar otro archivo?'
    );
  }, [addBotMessage]);

  // ─── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setMessages([WELCOME_MESSAGE]);
    setActiveWidgetId('bot-welcome');
    setIsTyping(false);
  }, [dispatch]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatWindow
        messages={messages}
        activeWidgetId={activeWidgetId}
        isTyping={isTyping}
        onFileLoaded={handleFileLoaded}
        onColumnChosen={handleColumnChosen}
        onFilterChosen={handleFilterChosen}
        onColumnsChosen={handleColumnsChosen}
        onDownloadComplete={handleDownloadComplete}
      />

      {/* Botón de reset */}
      {messages.length > 1 && !isTyping && (
        <div className="border-t border-gray-200 px-4 py-3 bg-white">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
          >
            <RefreshCw size={12} />
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
