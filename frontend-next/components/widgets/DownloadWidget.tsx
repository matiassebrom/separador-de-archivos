'use client';

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

  const previewName = state.baseName
    ? `${state.baseName} - ${state.separateBy} - [valor].xlsx`
    : `[nombre] - ${state.separateBy} - [valor].xlsx`;

  return (
    <div className="border border-mr-border rounded-[8px] bg-mr-surface p-4 flex flex-col gap-4">
      {/* Resumen de configuracion */}
      <div className="bg-mr-surface-2 border border-mr-border rounded-[8px] p-3 flex flex-col gap-1.5">
        <div className="flex gap-2">
          <span className="mono text-[11px] text-mr-muted tracking-[0.4px] w-28">Separar por:</span>
          <span className="mono text-[11px] text-mr-fg-2 tracking-[0.4px]">{state.separateBy}</span>
        </div>
        {state.filter && (
          <div className="flex gap-2">
            <span className="mono text-[11px] text-mr-muted tracking-[0.4px] w-28">Filtro activo:</span>
            <span className="mono text-[11px] text-mr-fg-2 tracking-[0.4px]">
              {state.filter.header} = {state.filter.values.join(', ')}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="mono text-[11px] text-mr-muted tracking-[0.4px] w-28">Columnas:</span>
          <span className="mono text-[11px] text-mr-fg-2 tracking-[0.4px]">{state.keepCols.length} seleccionadas</span>
        </div>
        <div className="flex gap-2">
          <span className="mono text-[11px] text-mr-muted tracking-[0.4px] w-28">Filas totales:</span>
          <span className="mono text-[11px] text-mr-fg-2 tracking-[0.4px]">{state.rows.length}</span>
        </div>
      </div>

      {/* Input nombre base */}
      <div className="flex flex-col gap-1.5">
        <p className="mono text-[10.5px] text-mr-muted-2 tracking-[1.4px] uppercase">
          Nombre base para los archivos
        </p>
        <input
          className="w-full bg-mr-surface-2 border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors disabled:opacity-50"
          value={state.baseName}
          onChange={(e) => dispatch({ type: 'SET_BASE_NAME', payload: e.target.value })}
          placeholder="Ej: Reporte Ventas 2024"
          disabled={done}
        />
        <p className="mono text-[11px] text-mr-dim tracking-[0.4px] truncate">
          → {previewName}
        </p>
      </div>

      {error && (
        <p className="text-[13px] text-[#f87171] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-[6px] px-3 py-2">
          {error}
        </p>
      )}

      {done ? (
        <div className="flex items-center justify-center gap-2 text-[#86efac] bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.35)] rounded-[8px] py-3">
          <CheckCircle size={18} />
          <span className="text-[14px] font-medium">Descarga iniciada con éxito</span>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          disabled={isGenerating || !state.baseName}
          className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2.5 text-[14px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex flex-col items-center gap-2 w-full">
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Generando archivos... {progress}%
              </span>
              <span className="w-full bg-mr-blue-lo rounded-full h-1.5">
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
