// utils/conversion.ts
export function formatActivityValue(value: number, unit: number): string {
    if (unit === 2) {
      const totalSeconds = value;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (unit === 1) {
      const kmValue = value / 1000;
      const rounded = parseFloat(kmValue.toFixed(2));
      return `${rounded} km`;
    }
    return `${value.toLocaleString('no-NO')}`;
  }
  
  export function parseActivityValue(displayValue: string, unit: number): number {
    if (unit === 2) {
      const [m, s] = displayValue.split(':').map((x) => parseInt(x, 10) || 0);
      return m * 60 + s;
    } else if (unit === 1) {
      const km = parseFloat(displayValue.replace(',', '.')) || 0;
      return Math.round(km * 1000);
    }
    return parseInt(displayValue.replace(/\s/g, ""), 10) || 0;
  }
  