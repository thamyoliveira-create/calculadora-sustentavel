export function formatBRL(value: number, symbol = 'R$'): string {
  if (!Number.isFinite(value)) value = 0;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace('R$', symbol);
}

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) value = 0;
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) value = 0;
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatDate(date: string | Date, fmt = 'DD/MM/YYYY'): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  if (fmt === 'MM/YYYY') return `${mm}/${yyyy}`;
  if (fmt === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`;
  return `${dd}/${mm}/${yyyy}`;
}

export function monthKey(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}`;
}

export function monthLabel(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function shortMonthLabel(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
}

export function toInputDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function todayInputDate(): string {
  return toInputDate(new Date());
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function startOfMonth(date: Date, monthStartDay = 1): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), monthStartDay);
  return d;
}

export function endOfMonth(date: Date, monthStartDay = 1): Date {
  const start = startOfMonth(date, monthStartDay);
  return addMonths(start, 1);
}

/** Returns YYYY-MM for a month offset relative to now (0 = current). */
export function monthKeyOffset(offset: number): string {
  const d = addMonths(new Date(), offset);
  return monthKey(d);
}
