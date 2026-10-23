import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
const storageKey = 'portfolio.theme.v1';
const listeners = new Set<() => void>();
let preference: Theme | null = readPreference();

function readPreference(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme() {
  const theme = preference ?? 'dark';
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.removeProperty('background-color');
  const preview = root.classList.contains('revision-preview');
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      'content',
      preview
        ? theme === 'dark'
          ? '#141414'
          : '#f5f5f3'
        : theme === 'dark'
          ? '#191c18'
          : '#f7f6f2',
    );
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key === storageKey || event.key === null) {
    preference = readPreference();
    applyTheme();
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    preference = readPreference();
    window.addEventListener('storage', onStorage);
    applyTheme();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function setTheme(theme: Theme) {
  preference = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Keep the choice for this visit when storage is unavailable.
  }
  applyTheme();
}

const snapshot = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot);
}
