'use client';

import { useState, useCallback } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { X } from 'lucide-react';

interface Props {
  onColumnsChosen: (cols: string[]) => void;
}

const DEFAULT_COLS = ['ORIGEN', 'ID', 'Q_TerminateFlag'];

export function ColumnChecklist({ onColumnsChosen }: Props) {
  const { state } = useAppStateContext();
  const [checked, setChecked] = useState<Set<string>>(() => {
    const defaults = DEFAULT_COLS.filter((c) => state.headers.includes(c));
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

  const checkedInOrder = state.headers.filter((h) => checked.has(h));

  return (
    <div className="border border-mr-border rounded-[8px] bg-mr-surface p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="mono text-[11px] text-mr-muted tracking-[0.4px]">
          {checked.size} de {state.headers.length} columnas seleccionadas
        </span>
        <div className="flex gap-2 mono text-[11px] tracking-[0.4px]">
          <button
            onClick={() => setChecked(new Set(state.headers))}
            className="text-mr-blue-hi hover:text-mr-fg cursor-pointer transition-colors"
          >
            Todas
          </button>
          <span className="text-mr-dim">|</span>
          <button
            onClick={() => setChecked(new Set())}
            className="text-mr-muted-2 hover:text-mr-fg cursor-pointer transition-colors"
          >
            Ninguna
          </button>
        </div>
      </div>

      <input
        className="w-full bg-mr-surface-2 border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors"
        placeholder="Buscar columna..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-44 overflow-y-auto mr-scroll space-y-0.5 pr-1">
        {filteredHeaders.map((h) => (
          <label
            key={h}
            className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-mr-surface-2 rounded-[6px] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked.has(h)}
              onChange={() => toggle(h)}
              className="rounded accent-mr-blue"
            />
            <span className="text-[14px] text-mr-fg-2">{h}</span>
          </label>
        ))}
      </div>

      {checkedInOrder.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-mr-border">
          {checkedInOrder.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1 bg-mr-blue-soft border border-mr-blue-ring text-[#93c5fd] mono text-[11px] tracking-[0.4px] px-2 py-1 rounded-full"
            >
              {h}
              <button onClick={() => toggle(h)} className="hover:text-mr-fg cursor-pointer">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        disabled={checked.size === 0}
        onClick={() => onColumnsChosen(checkedInOrder)}
        className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirmar columnas ({checked.size})
      </button>
    </div>
  );
}
