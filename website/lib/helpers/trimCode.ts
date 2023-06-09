export const trimCode = (code: string | string[]): string => {
  const s = Array.isArray(code) ? code.join('\n') : code
  return s.trim()
}
