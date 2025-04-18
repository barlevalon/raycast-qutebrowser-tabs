export interface DebugInfo {
  locations_checked: string[];
  files_found: string[];
  errors: string[];
  qutebrowser_running?: boolean;
  autosave_path?: string;
  success_file?: string;
  tabs_found?: number;
}

// Interfaces for the YAML session file structure
export interface HistoryEntry {
  url: string;
  title?: string;
  active?: boolean;
}

export interface SessionTab {
  history: HistoryEntry[];
  active?: boolean;
  tabs?: SessionTab[];
}

export interface SessionWindow {
  tabs: SessionTab[];
}

export interface SessionData {
  windows: SessionWindow[];
}

export interface Tab {
  window: number;
  index: number;
  url: string;
  title: string;
  active: boolean;
  debug?: DebugInfo; // Optional debug information
}

export interface Preferences {
  qutebrowserPath: string;
}
