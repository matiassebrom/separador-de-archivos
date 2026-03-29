'use client';

/**
 * MIGRACIÓN de step3-filters.component (el más complejo)
 *
 * Angular:  dos mat-select + checkboxes con ngModel, lógica en el componente
 * React:    useState local para filterCol/colValues/selectedValues/search
 *
 * Nota sobre Set en React: React requiere que el estado sea inmutable.
 * No podés mutar un Set directamente. El patrón es:
 *   setSelectedValues(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v])
 * Esto crea un nuevo array en cada cambio, igual que [...array, item] en Angular.
 *
 * Este paso es opcional – el botón "Saltear este paso" pasa null como filtro.
 */

import { useState, useCallback } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { getUniqueValues } from '@/lib/excel';
import { FilterConfig } from '@/lib/types';
import { X, Filter } from 'lucide-react';

interface Props {
  onFilterChosen: (filter: FilterConfig | null) => void;
}

const DEFAULT_FILTER_COL = 'Q_TerminateFlag';

export function FilterWidget({ onFilterChosen }: Props) {
  const { state } = useAppStateContext();
  const [filterCol, setFilterCol] = useState(() =>
    state.headers.includes(DEFAULT_FILTER_COL) ? DEFAULT_FILTER_COL : ''
  );
  const [colValues, setColValues] = useState<string[]>(() =>
    state.headers.includes(DEFAULT_FILTER_COL)
      ? getUniqueValues(state.rows, DEFAULT_FILTER_COL)
      : []
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [colSearch, setColSearch] = useState('');
  const [valSearch, setValSearch] = useState('');

  const handleColChange = useCallback((col: string) => {
    setFilterCol(col);
    setSelectedValues([]);
    setColValues(col ? getUniqueValues(state.rows, col) : []);
  }, [state.rows]);

  const toggleValue = useCallback((v: string) => {
    setSelectedValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  }, []);

  const filteredCols = state.headers.filter((h) =>
    h.toLowerCase().includes(colSearch.toLowerCase())
  );

  const filteredVals = colValues.filter((v) =>
    v.toLowerCase().includes(valSearch.toLowerCase())
  );

  const canConfirm = filterCol && selectedValues.length > 0;

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
      {/* Selector de columna */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Columna para filtrar
        </label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Buscar columna..."
          value={colSearch}
          onChange={(e) => setColSearch(e.target.value)}
        />
        <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
          {filteredCols.map((h) => (
            <button
              key={h}
              onClick={() => handleColChange(h)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors
                ${filterCol === h ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de valores (aparece cuando se elige columna) */}
      {filterCol && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Valores a conservar en <span className="font-semibold text-gray-700">{filterCol}</span>
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Buscar valor..."
            value={valSearch}
            onChange={(e) => setValSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
            {filteredVals.map((v) => (
              <label key={v} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(v)}
                  onChange={() => toggleValue(v)}
                  className="rounded accent-blue-500"
                />
                <span className="text-sm text-gray-700">{v}</span>
              </label>
            ))}
          </div>

          {/* Chips de selección */}
          {selectedValues.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedValues.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {v}
                  <button onClick={() => toggleValue(v)} className="hover:text-blue-900">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onFilterChosen(null)}
          className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Saltear este paso
        </button>
        <button
          disabled={!canConfirm}
          onClick={() => onFilterChosen({ header: filterCol, values: selectedValues })}
          className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium
            flex items-center justify-center gap-1.5
            disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          <Filter size={14} />
          Aplicar filtro
        </button>
      </div>
    </div>
  );
}
