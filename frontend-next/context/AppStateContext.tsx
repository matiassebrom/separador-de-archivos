'use client';

/**
 * MIGRACIÓN: Este Context reemplaza la inyección de dependencias de Angular.
 *
 * En Angular: @Injectable({ providedIn: 'root' }) crea un singleton global.
 *             Cualquier componente lo recibe en el constructor: constructor(private fs: FileStateService)
 *
 * En React:   AppStateProvider envuelve toda la app una vez (en layout.tsx).
 *             Cualquier componente hijo llama useAppStateContext() para leer/mutar el estado.
 *             Es exactamente lo mismo conceptualmente, sin decoradores.
 */

import { createContext, useContext, ReactNode } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { AppState, AppAction } from '@/lib/types';

interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useAppState();
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppStateContext() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppStateContext debe usarse dentro de AppStateProvider');
  return ctx;
}
