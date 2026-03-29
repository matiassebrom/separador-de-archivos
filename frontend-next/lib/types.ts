export interface FilterConfig {
  header: string;
  values: string[];
}

export interface AppState {
  rows: Record<string, any>[];
  headers: string[];
  filename: string;
  separateBy: string;
  filter: FilterConfig | null;
  keepCols: string[];
  baseName: string;
}

export type AppAction =
  | { type: 'SET_FILE_DATA'; payload: { rows: Record<string, any>[]; headers: string[]; filename: string } }
  | { type: 'SET_SEPARATE_BY'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterConfig | null }
  | { type: 'SET_KEEP_COLS'; payload: string[] }
  | { type: 'SET_BASE_NAME'; payload: string }
  | { type: 'RESET' };

export type ChatWidgetType =
  | 'file-drop'
  | 'column-selector'
  | 'filter-config'
  | 'column-checklist'
  | 'download';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  widget?: ChatWidgetType;
}
