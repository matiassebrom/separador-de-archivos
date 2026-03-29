'use client';

/**
 * MIGRACIÓN: reemplaza el acordeón de app.component.html
 *
 * Angular:  mat-accordion con 5 expansion panels
 * React:    lista de mensajes que crece dinámicamente con auto-scroll
 *
 * useRef: crea una referencia a un elemento del DOM sin causar re-renders.
 *   Equivale a @ViewChild en Angular.
 *
 * useEffect con [messages.length]: corre cada vez que se agrega un mensaje nuevo.
 *   Equivale a ngOnChanges vigilando el array de mensajes.
 */

import { useEffect, useRef } from 'react';
import { ChatMessage, FilterConfig } from '@/lib/types';
import { BotMessage } from './BotMessage';
import { UserMessage } from './UserMessage';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: ChatMessage[];
  activeWidgetId: string | null;
  isTyping: boolean;
  onFileLoaded: (data: { headers: string[]; rows: Record<string, any>[]; filename: string }) => Promise<void>;
  onColumnChosen: (col: string) => void;
  onFilterChosen: (filter: FilterConfig | null) => void;
  onColumnsChosen: (cols: string[]) => void;
  onDownloadComplete: () => void;
}

export function ChatWindow({
  messages,
  activeWidgetId,
  isTyping,
  onFileLoaded,
  onColumnChosen,
  onFilterChosen,
  onColumnsChosen,
  onDownloadComplete,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llega un nuevo mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg) =>
        msg.role === 'bot' ? (
          <BotMessage
            key={msg.id}
            message={msg}
            isActive={msg.id === activeWidgetId}
            onFileLoaded={onFileLoaded}
            onColumnChosen={onColumnChosen}
            onFilterChosen={onFilterChosen}
            onColumnsChosen={onColumnsChosen}
            onDownloadComplete={onDownloadComplete}
          />
        ) : (
          <UserMessage key={msg.id} message={msg} />
        )
      )}

      {/* Indicador de typing mientras el bot "piensa" */}
      {isTyping && <TypingIndicator />}

      {/* Ancla para el scroll automático */}
      <div ref={bottomRef} />
    </div>
  );
}
