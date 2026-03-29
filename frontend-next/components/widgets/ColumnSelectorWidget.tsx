'use client';

/**
 * MIGRACIÓN de step2-separate-by.component
 *
 * Angular:  mat-select con búsqueda manual, emite evento al padre vía EventEmitter
 * React:    lista de botones con búsqueda vía useState, callback prop onColumnChosen
 *
 * La lista filtrada (filtered) es una const derivada de state.headers y search.
 * Se recalcula en cada render – equivalente al getter filteredHeaders() de Angular,
 * pero sin necesidad de computed() porque en React los renders son baratos para listas pequeñas.
 */

import { useState } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { Check } from 'lucide-react';

interface Props {
  onColumnChosen: (col: string) => void;
}

const DEFAULT_SEPARATE_BY = 'ORIGEN';

export function ColumnSelectorWidget({ onColumnChosen }: Props) {
  const { state } = useAppStateContext();
  const [search, setSearch] = useState('');
  // Pre-selecciona ORIGEN si existe en los headers del archivo; si no, queda vacío
  const [selected, setSelected] = useState(() =>
    state.headers.includes(DEFAULT_SEPARATE_BY) ? DEFAULT_SEPARATE_BY : ''
  );

  const filtered = state.headers.filter((h) =>
    h.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <input
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Buscar columna..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-3">Sin resultados</p>
        )}
        {filtered.map((h) => (
          <button
            key={h}
            onClick={() => setSelected(h)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
              ${selected === h
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            <span>{h}</span>
            {selected === h && <Check size={14} />}
          </button>
        ))}
      </div>
      <button
        disabled={!selected}
        onClick={() => onColumnChosen(selected)}
        className="mt-3 w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Confirmar columna
      </button>
    </div>
  );
}
