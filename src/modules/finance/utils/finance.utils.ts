export function dollarsToCents(value: string) {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100);
}
