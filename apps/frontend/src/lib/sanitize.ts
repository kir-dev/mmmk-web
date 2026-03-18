/* eslint-disable no-control-regex */
export function sanitizeUtfInput(value: string): string {
  if (typeof value !== 'string') return '';
  // Normalize to NFC to avoid mixed canonical forms
  let s = value.normalize('NFC');
  // Remove control characters (C0/C1) except tab, newline, carriage return
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  return s;
}
