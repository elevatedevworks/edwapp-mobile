export function dollarsToCents(value: string) {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100);
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
