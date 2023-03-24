// @ts-expect-error @todo TODO: fix this error
export function cleanMeasureUnit(value: string) {
  if (value.length != 0) {
    return value.slice(0, value.length - 2);
  }
}

export const getAspectRatio = (width: number, height: number): number => {
  return Number((width / height).toFixed(1));
};
