'use client';

/**
 * MIGRACIÓN: Este hook reemplaza FileStateService de Angular.
 *
 * En Angular: service con signals inyectado en el constructor de cada componente.
 * En React:   useReducer agrupa todo el estado en un objeto, y dispatch() lo muta
 *             con acciones nombradas. El Context (AppStateContext) lo comparte globalmente.
 *
 * Equivalencias:
 *   signal.set(x)      →  dispatch({ type: 'SET_X', payload: x })
 *   signal()           →  state.x
 *   clearFile()        →  dispatch({ type: 'RESET' })
 */

import { useReducer } from 'react';
import { AppState, AppAction } from '@/lib/types';

const initialState: AppState = {
  rows: [],
  headers: [],
  filename: '',
  separateBy: '',
  filter: null,
  keepCols: [],
  baseName: '',
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FILE_DATA':
      return {
        ...state,
        rows: action.payload.rows,
        headers: action.payload.headers,
        filename: action.payload.filename,
        // Auto-completa baseName con el nombre del archivo sin extensión
        baseName: action.payload.filename.replace(/\.[^/.]+$/, ''),
      };
    case 'SET_SEPARATE_BY':
      return { ...state, separateBy: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_KEEP_COLS':
      return { ...state, keepCols: action.payload };
    case 'SET_BASE_NAME':
      return { ...state, baseName: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
