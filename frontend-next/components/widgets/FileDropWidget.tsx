'use client';

import { useState, useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { readFile, getSheetNames } from '@/lib/excel';
import { ExcelRow } from '@/lib/types';

interface FileData {
  headers: string[];
  rows: ExcelRow[];
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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = progress !== null;

  const parseSheet = useCallback(async (file: File, sheetName?: string) => {
    setProgress(0);
    setError(null);
    try {
      const { headers, rows } = await readFile(file, (pct) => setProgress(pct), sheetName);
      await onFileLoaded({ headers, rows, filename: file.name });
    } catch {
      setError('Error al leer el archivo. Verificá que sea un Excel válido.');
      setProgress(null);
    }
  }, [onFileLoaded]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.xlsx?$/i)) {
      setError('Solo se aceptan archivos .xlsx o .xls');
      return;
    }
    setError(null);
    try {
      const sheets = await getSheetNames(file);
      if (sheets.length > 1) {
        const autoMatch = sheets.find((s) => s.toLowerCase() === 'raw data') ?? '';
        setPendingFile(file);
        setSheetNames(sheets);
        setSelectedSheet(autoMatch);
      } else {
        await parseSheet(file, sheets[0]);
      }
    } catch {
      setError('Error al leer el archivo. Verificá que sea un Excel válido.');
    }
  }, [parseSheet]);

  const handleSheetConfirm = useCallback(async () => {
    if (!pendingFile || !selectedSheet) return;
    setSheetNames(null);
    await parseSheet(pendingFile, selectedSheet);
    setPendingFile(null);
  }, [pendingFile, selectedSheet, parseSheet]);

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

  if (sheetNames) {
    const autoWasSet = sheetNames.some((s) => s.toLowerCase() === 'raw data');
    return (
      <div className="border border-mr-border rounded-[8px] bg-mr-surface flex flex-col">
        <div className="px-6 pt-6 pb-3">
          <p className="text-[14px] font-medium text-mr-fg">El archivo tiene varias pestanas</p>
          <p className="text-[13px] text-mr-muted-2 font-light mt-1">Elegí cual querés usar:</p>
        </div>
        <div className="max-h-52 overflow-y-auto mr-scroll flex flex-col gap-1 px-6 pb-2">
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedSheet(name)}
              className={`w-full text-left px-4 py-2.5 rounded-[6px] border text-[14px] transition-colors cursor-pointer flex items-center justify-between shrink-0 ${
                selectedSheet === name
                  ? 'bg-mr-blue border-mr-blue text-white'
                  : 'border-mr-border text-mr-fg hover:bg-mr-surface-2 hover:border-mr-border-2'
              }`}
            >
              <span>{name}</span>
              {selectedSheet === name && autoWasSet && name.toLowerCase() === 'raw data' && (
                <span className="mono text-[10px] tracking-[0.4px] opacity-80">por defecto</span>
              )}
            </button>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-mr-border flex flex-col gap-3 mt-1">
          {autoWasSet && selectedSheet.toLowerCase() === 'raw data' && (
            <p className="mono text-[11px] text-mr-blue-hi tracking-[0.4px]">Seleccionado "Raw data" por defecto</p>
          )}
          <button
            disabled={!selectedSheet}
            onClick={handleSheetConfirm}
            className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar pestana
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-[8px] p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-mr-blue bg-mr-blue-soft'
          : 'border-mr-border bg-mr-surface hover:border-mr-border-2 hover:bg-mr-surface-2'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <UploadCloud
        className={`mx-auto mb-3 ${isDragging ? 'text-mr-blue-hi' : 'text-mr-muted'}`}
        size={36}
      />
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-[14px] font-medium text-mr-blue-hi">{getLabel(progress ?? 0)}</p>
          <div className="w-full bg-mr-surface-3 rounded-full h-2 overflow-hidden">
            <div
              className="bg-mr-blue h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
          <p className="mono text-[11px] text-mr-dim tracking-[0.4px]">{progress ?? 0}%</p>
        </div>
      ) : (
        <>
          <p className="text-[14px] text-mr-fg-2 font-light">
            Arrastrá tu Excel aquí o hacé clic para elegir
          </p>
          <p className="mono text-[11px] text-mr-dim mt-1 tracking-[0.4px]">.xlsx, .xls</p>
        </>
      )}
      {error && (
        <p className="mt-3 text-[13px] text-[#f87171] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-[6px] px-3 py-2">
          {error}
        </p>
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
