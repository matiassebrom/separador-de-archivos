'use client';

import { useState } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { Check } from 'lucide-react';

interface Props {
  onColumnChosen: (col: string) => void;
}

export function ColumnSelectorWidget({ onColumnChosen }: Props) {
  const { state } = useAppStateContext();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(() => {
    const match = state.headers.find((h) => h.toLowerCase() === 'origen');
    return match ?? '';
  });
  const autoSelected = state.headers.some((h) => h.toLowerCase() === 'origen');

  const filtered = state.headers.filter((h) =>
    h.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border border-mr-border rounded-[8px] bg-mr-surface p-4 flex flex-col gap-3">
      <input
        className="w-full bg-mr-surface-2 border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors"
        placeholder="Buscar columna..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <div className="max-h-52 overflow-y-auto mr-scroll space-y-1 pr-1">
        {filtered.length === 0 && (
          <p className="mono text-[11px] text-mr-dim text-center py-3 tracking-[0.4px]">Sin resultados</p>
        )}
        {filtered.map((h) => (
          <button
            key={h}
            onClick={() => setSelected(h)}
            className={`w-full text-left px-3 py-2 rounded-[6px] text-[14px] transition-colors flex items-center justify-between cursor-pointer ${
              selected === h
                ? 'bg-mr-blue text-white'
                : 'hover:bg-mr-surface-2 text-mr-fg-2 hover:text-mr-fg'
            }`}
          >
            <span>{h}</span>
            {selected === h && <Check size={14} />}
          </button>
        ))}
      </div>
      {autoSelected && selected.toLowerCase() === 'origen' && (
        <p className="mono text-[11px] text-mr-blue-hi tracking-[0.4px]">Seleccionado "ORIGEN" por defecto</p>
      )}
      <button
        disabled={!selected}
        onClick={() => onColumnChosen(selected)}
        className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirmar columna
      </button>
    </div>
  );
}
