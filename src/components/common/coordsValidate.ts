export function parseCoords(coord): string[] {
  const regExp = /^(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)$/;
  const result = regExp.exec(coord);
  return result !== null ? result.slice(1) : null;
}
