'use client';

/**
 * Burbuja del bot.
 *
 * Si isActive=true → renderiza el widget interactivo embebido.
 * Si isActive=false → el widget ya fue completado, solo muestra texto (solo lectura).
 *
 * Los callbacks son opcionales porque no todos los mensajes tienen widget.
 */

import { ChatMessage, FilterConfig } from '@/lib/types';
import { FileDropWidget } from '@/components/widgets/FileDropWidget';
import { ColumnSelectorWidget } from '@/components/widgets/ColumnSelectorWidget';
import { FilterWidget } from '@/components/widgets/FilterWidget';
import { ColumnChecklist } from '@/components/widgets/ColumnChecklist';
import { DownloadWidget } from '@/components/widgets/DownloadWidget';

interface Props {
  message: ChatMessage;
  isActive: boolean;
  onFileLoaded?: (data: { headers: string[]; rows: Record<string, any>[]; filename: string }) => Promise<void>;
  onColumnChosen?: (col: string) => void;
  onFilterChosen?: (filter: FilterConfig | null) => void;
  onColumnsChosen?: (cols: string[]) => void;
  onDownloadComplete?: () => void;
}

export function BotMessage({
  message,
  isActive,
  onFileLoaded,
  onColumnChosen,
  onFilterChosen,
  onColumnsChosen,
  onDownloadComplete,
}: Props) {
  return (
    <div className="flex gap-3 my-2">
      {/* Avatar del bot */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
        AI
      </div>

      <div className="flex-1 max-w-[85%]">
        {/* Burbuja de texto */}
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 shadow-sm leading-relaxed">
          {message.text}
        </div>

        {/* Widget interactivo – solo si este mensaje está activo */}
        {message.widget && isActive && (
          <>
            {message.widget === 'file-drop' && onFileLoaded && (
              <FileDropWidget onFileLoaded={onFileLoaded} />
            )}
            {message.widget === 'column-selector' && onColumnChosen && (
              <ColumnSelectorWidget onColumnChosen={onColumnChosen} />
            )}
            {message.widget === 'filter-config' && onFilterChosen && (
              <FilterWidget onFilterChosen={onFilterChosen} />
            )}
            {message.widget === 'column-checklist' && onColumnsChosen && (
              <ColumnChecklist onColumnsChosen={onColumnsChosen} />
            )}
            {message.widget === 'download' && onDownloadComplete && (
              <DownloadWidget onDownloadComplete={onDownloadComplete} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
