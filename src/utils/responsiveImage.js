export function responsiveImagePath(source, width) {
  const normalized = String(source || '').replace(/^\/+/, '');
  const extensionIndex = normalized.lastIndexOf('.');
  const base = extensionIndex >= 0 ? normalized.slice(0, extensionIndex) : normalized;
  return `/optimized/${base}-${width}.webp`;
}

export function responsiveImageSrcset(source, widths) {
  return widths.map(width => `${responsiveImagePath(source, width)} ${width}w`).join(', ');
}
