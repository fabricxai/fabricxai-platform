// Figma Make exports import images via the `figma:asset/<hash>.png` scheme,
// resolved to real files under /public/assets by next.config alias. This
// ambient declaration lets TypeScript understand those imports (they resolve
// to a string URL).
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
