'use client';

import { useState, useCallback } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { getUniqueValues } from '@/lib/excel';
import { FilterConfig } from '@/lib/types';
import { X } from 'lucide-react';

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
    <div className="border border-mr-border rounded-[8px] bg-mr-surface p-4 flex flex-col gap-4">
      {/* Selector de columna */}
      <div className="flex flex-col gap-2">
        <p className="mono text-[10.5px] text-mr-muted-2 tracking-[1.4px] uppercase">
          Columna para filtrar
        </p>
        <input
          className="w-full bg-mr-surface-2 border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors"
          placeholder="Buscar columna..."
          value={colSearch}
          onChange={(e) => setColSearch(e.target.value)}
        />
        <div className="max-h-36 overflow-y-auto mr-scroll space-y-1 pr-1">
          {filteredCols.map((h) => (
            <button
              key={h}
              onClick={() => handleColChange(h)}
              className={`w-full text-left px-3 py-1.5 rounded-[6px] text-[14px] transition-colors cursor-pointer ${
                filterCol === h
                  ? 'bg-mr-blue text-white'
                  : 'hover:bg-mr-surface-2 text-mr-fg-2 hover:text-mr-fg'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de valores */}
      {filterCol && (
        <div className="flex flex-col gap-2">
          <p className="mono text-[10.5px] text-mr-muted-2 tracking-[1.4px] uppercase">
            Valores a conservar en{' '}
            <span className="text-mr-fg">{filterCol}</span>
          </p>
          <input
            className="w-full bg-mr-surface-2 border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors"
            placeholder="Buscar valor..."
            value={valSearch}
            onChange={(e) => setValSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto mr-scroll space-y-0.5 pr-1">
            {filteredVals.map((v) => (
              <label
                key={v}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-mr-surface-2 rounded-[6px] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(v)}
                  onChange={() => toggleValue(v)}
                  className="rounded accent-mr-blue"
                />
                <span className="text-[14px] text-mr-fg-2">{v}</span>
              </label>
            ))}
          </div>

          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedValues.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-mr-blue-soft border border-mr-blue-ring text-[#93c5fd] mono text-[11px] tracking-[0.4px] px-2 py-1 rounded-full"
                >
                  {v}
                  <button onClick={() => toggleValue(v)} className="hover:text-mr-fg cursor-pointer">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onFilterChosen(null)}
          className="flex-1 border border-mr-border text-mr-fg-2 hover:bg-mr-surface-2 hover:text-mr-fg rounded-[6px] py-2 text-[14px] transition-colors cursor-pointer"
        >
          Saltear este paso
        </button>
        <button
          disabled={!canConfirm}
          onClick={() => onFilterChosen({ header: filterCol, values: selectedValues })}
          className="flex-1 bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] py-2 text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Aplicar filtro
        </button>
      </div>
    </div>
  );
}
