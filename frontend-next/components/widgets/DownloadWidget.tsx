'use client';

/**
 * MIGRACIÓN de step5-download.component
 *
 * Angular:  input de texto + botón, llama LocalExcelService.generateAndDownloadZip()
 * React:    igual, pero llama la función importada de lib/zip.ts
 *
 * La lógica de generación del ZIP es idéntica – solo cambió cómo se llama
 * (función importada en vez de service inyectado).
 */

import { useState } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { generateAndDownloadZip } from '@/lib/zip';
import { Download, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  onDownloadComplete: () => void;
}

export function DownloadWidget({ onDownloadComplete }: Props) {
  const { state, dispatch } = useAppStateContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    try {
      await generateAndDownloadZip(
        state.rows,
        state.separateBy,
        state.filter,
        state.keepCols,
        state.baseName,
        setProgress
      );
      setDone(true);
      onDownloadComplete();
    } catch (err) {
      setError('Error al generar el ZIP. Intentá de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview del nombre de los archivos
  const previewName = state.baseName
    ? `${state.baseName} - ${state.separateBy} - [valor].xlsx`
    : `[nombre] - ${state.separateBy} - [valor].xlsx`;

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
      {/* Resumen de configuración */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1.5">
        <div className="flex gap-2">
          <span className="text-gray-400 w-28">Separar por:</span>
          <span className="font-medium text-gray-700">{state.separateBy}</span>
        </div>
        {state.filter && (
          <div className="flex gap-2">
            <span className="text-gray-400 w-28">Filtro activo:</span>
            <span className="font-medium text-gray-700">
              {state.filter.header} = {state.filter.values.join(', ')}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-gray-400 w-28">Columnas:</span>
          <span className="font-medium text-gray-700">{state.keepCols.length} seleccionadas</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 w-28">Filas totales:</span>
          <span className="font-medium text-gray-700">{state.rows.length}</span>
        </div>
      </div>

      {/* Input del nombre base */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Nombre base para los archivos
        </label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={state.baseName}
          onChange={(e) => dispatch({ type: 'SET_BASE_NAME', payload: e.target.value })}
          placeholder="Ej: Reporte Ventas 2024"
          disabled={done}
        />
        <p className="text-xs text-gray-400 mt-1.5 font-mono truncate">
          → {previewName}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {done ? (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg py-3">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Descarga iniciada con éxito</span>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          disabled={isGenerating || !state.baseName}
          className="w-full bg-green-500 text-white rounded-lg py-2.5 text-sm font-medium
            flex items-center justify-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          {isGenerating ? (
            <span className="flex flex-col items-center gap-2 w-full">
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Generando archivos... {progress}%
              </span>
              <span className="w-full bg-green-400/40 rounded-full h-1.5">
                <span
                  className="block bg-white rounded-full h-1.5 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </span>
          ) : (
            <>
              <Download size={16} />
              Generar y descargar ZIP
            </>
          )}
        </button>
      )}
    </div>
  );
}
