'use client';

/**
 * MIGRACIÓN de step4-choose-columns.component
 *
 * Angular:  mat-select múltiple con chips para mostrar seleccionados
 * React:    checkboxes con Set<string> en useState + chips renderizados
 *
 * Nota sobre inmutabilidad con Set en React:
 *   NO podés hacer: mySet.add(item); setState(mySet)  ← React no detecta el cambio
 *   SÍ podés hacer: setState(prev => new Set(prev).add(item))  ← nuevo Set = nuevo render
 *
 * Arranca con las columnas por defecto pre-seleccionadas; si ninguna existe en el archivo,
 * cae a todas las columnas.
 */

import { useState, useCallback } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { X, Columns } from 'lucide-react';

interface Props {
  onColumnsChosen: (cols: string[]) => void;
}

// Columnas que se pre-seleccionan por defecto (solo las que existan en el archivo)
const DEFAULT_COLS = ['ORIGEN', 'ID', 'Q_TerminateFlag'];

export function ColumnChecklist({ onColumnsChosen }: Props) {
  const { state } = useAppStateContext();
  const [checked, setChecked] = useState<Set<string>>(() => {
    const defaults = DEFAULT_COLS.filter((c) => state.headers.includes(c));
    // Si ninguna columna default existe en el archivo, selecciona todas
    return new Set(defaults.length > 0 ? defaults : state.headers);
  });
  const [search, setSearch] = useState('');

  const toggle = useCallback((h: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(h)) {
        next.delete(h);
      } else {
        next.add(h);
      }
      return next;
    });
  }, []);

  const filteredHeaders = state.headers.filter((h) =>
    h.toLowerCase().includes(search.toLowerCase())
  );

  // Mantener el orden original de headers en las chips
  const checkedInOrder = state.headers.filter((h) => checked.has(h));

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {checked.size} de {state.headers.length} columnas seleccionadas
        </span>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setChecked(new Set(state.headers))}
            className="text-blue-500 hover:underline"
          >
            Todas
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setChecked(new Set())}
            className="text-gray-500 hover:underline"
          >
            Ninguna
          </button>
        </div>
      </div>

      <input
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Buscar columna..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
        {filteredHeaders.map((h) => (
          <label
            key={h}
            className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked.has(h)}
              onChange={() => toggle(h)}
              className="rounded accent-blue-500"
            />
            <span className="text-sm text-gray-700">{h}</span>
          </label>
        ))}
      </div>

      {/* Chips de columnas seleccionadas */}
      {checkedInOrder.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
          {checkedInOrder.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {h}
              <button onClick={() => toggle(h)} className="hover:text-blue-900">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        disabled={checked.size === 0}
        onClick={() => onColumnsChosen(checkedInOrder)}
        className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium
          flex items-center justify-center gap-1.5
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        <Columns size={14} />
        Confirmar columnas ({checked.size})
      </button>
    </div>
  );
}
