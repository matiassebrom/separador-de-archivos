'use client';

/**
 * MIGRACIÓN de step1-upload.component
 *
 * Angular:  evento (fileSelected) emitido con @Output EventEmitter
 * React:    prop de callback onFileLoaded(file: File)
 *
 * El drag-and-drop usa exactamente los mismos eventos del browser (onDrop, onDragOver, onDragLeave).
 * La diferencia es que usamos useState en vez de signals para isDragging/isLoading/error.
 */

import { useState, useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { readFile } from '@/lib/excel';

interface FileData {
  headers: string[];
  rows: Record<string, any>[];
  filename: string;
}

interface Props {
  onFileLoaded: (data: FileData) => Promise<void>;
}

const STAGE_LABEL: Record<number, string> = {
  0: 'Leyendo archivo...',
  65: 'Analizando estructura...',
  82: 'Extrayendo filas...',
  100: '¡Listo!',
};

function getLabel(progress: number): string {
  if (progress >= 100) return STAGE_LABEL[100];
  if (progress >= 82) return STAGE_LABEL[82];
  if (progress >= 65) return STAGE_LABEL[65];
  return STAGE_LABEL[0];
}

export function FileDropWidget({ onFileLoaded }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = progress !== null;

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.xlsx?$/i)) {
      setError('Solo se aceptan archivos .xlsx o .xls');
      return;
    }
    setProgress(0);
    setError(null);
    try {
      const { headers, rows } = await readFile(file, (pct) => setProgress(pct));
      await onFileLoaded({ headers, rows, filename: file.name });
    } catch {
      setError('Error al leer el archivo. Verificá que sea un Excel válido.');
      setProgress(null);
    }
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      className={`mt-2 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
        ${isDragging
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
        }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <UploadCloud
        className={`mx-auto mb-3 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`}
        size={36}
      />
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm font-medium text-blue-600">{getLabel(progress ?? 0)}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress ?? 0}%</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-700">
            Arrastrá tu Excel aquí o hacé clic para elegir
          </p>
          <p className="text-xs text-gray-400 mt-1">Formatos aceptados: .xlsx, .xls</p>
        </>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
