import { useSyncExternalStore } from 'react';

let codeLines = 0;
let listeners = new Set<() => void>();
let intervalId: NodeJS.Timeout | null = null;

export const terminalStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) {
      // Start interval when first listener subscribes
      intervalId = setInterval(() => {
        codeLines = (codeLines + 1) % 4;
        listeners.forEach(l => l());
      }, 1200);
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  },
  getSnapshot() {
    return codeLines;
  },
};

export function useCodeSkillTerminal() {
  return useSyncExternalStore(terminalStore.subscribe, terminalStore.getSnapshot, terminalStore.getSnapshot);
}
