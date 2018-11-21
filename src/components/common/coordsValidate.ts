export function parseCoords(coord): string[] {
  const regExp = /^(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)$/;
  const result = regExp.exec(coord);
  return result ? result.slice(1) : null;
}
