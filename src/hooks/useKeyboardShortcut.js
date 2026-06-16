import { useEffect } from 'react';

/**
 * Attach keyboard shortcuts to the document.
 * @param {string} key     - e.g. 'n', 'Escape'
 * @param {Function} cb    - handler function
 * @param {{ ctrl?: boolean, shift?: boolean, meta?: boolean }} mods
 */
export function useKeyboardShortcut(key, cb, mods = {}) {
  useEffect(() => {
    const handler = (e) => {
      if (mods.ctrl  && !e.ctrlKey)  return;
      if (mods.shift && !e.shiftKey) return;
      if (mods.meta  && !e.metaKey)  return;
      if (e.key === key) {
        e.preventDefault();
        cb(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, cb, mods.ctrl, mods.shift, mods.meta]);
}
