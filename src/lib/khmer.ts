/**
 * Khmer formatting helpers.
 *
 * `toLocaleDateString('km-KH')` is unreliable across browsers (Chrome on
 * Windows falls back to Latin digits and English month names), and the printed
 * letter has to read like an official Khmer document. So the mapping is
 * explicit here.
 */

const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

const KHMER_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

const KHMER_WEEKDAYS = [
  "អាទិត្យ",
  "ចន្ទ",
  "អង្គារ",
  "ពុធ",
  "ព្រហស្បតិ៍",
  "សុក្រ",
  "សៅរ៍",
];

/** Rewrites every Latin digit in a string as its Khmer numeral. */
export function toKhmerDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);
}

/**
 * Parses a `yyyy-mm-dd` value as a *local* date.
 * `new Date("2026-08-15")` is parsed as UTC midnight, which shifts the day
 * backwards for every timezone west of Greenwich — including nothing in
 * Cambodia, but the app is also used from browsers set to other zones.
 */
export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `ថ្ងៃសៅរ៍ ទី១៥ ខែសីហា ឆ្នាំ២០២៦` */
export function formatKhmerDate(value: string): string {
  const date = parseDateInput(value);
  if (!date) return "—";
  return [
    `ថ្ងៃ${KHMER_WEEKDAYS[date.getDay()]}`,
    `ទី${toKhmerDigits(date.getDate())}`,
    `ខែ${KHMER_MONTHS[date.getMonth()]}`,
    `ឆ្នាំ${toKhmerDigits(date.getFullYear())}`,
  ].join(" ");
}

/** `១៥ សីហា ២០២៦` — for tight spots like preview cards. */
export function formatKhmerDateShort(value: string): string {
  const date = parseDateInput(value);
  if (!date) return "—";
  return `${toKhmerDigits(date.getDate())} ${KHMER_MONTHS[date.getMonth()]} ${toKhmerDigits(
    date.getFullYear()
  )}`;
}

/** Khmer part-of-day label for a 24h hour. */
function periodOf(hour: number): string {
  if (hour < 12) return "ព្រឹក";
  if (hour < 17) return "រសៀល";
  if (hour < 19) return "ល្ងាច";
  return "យប់";
}

/** `ម៉ោង ៨:៣០ នាទីព្រឹក` */
export function formatKhmerTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return "—";
  const hour = Number(match[1]);
  const minute = match[2];
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `ម៉ោង ${toKhmerDigits(twelve)}:${toKhmerDigits(minute)} នាទី${periodOf(hour)}`;
}

/** Joins address parts into `ភូមិX ឃុំY ស្រុកZ ខេត្តW`, skipping blanks. */
export function formatKhmerAddress(parts: {
  village?: string;
  commune?: string;
  district?: string;
  province?: string;
}): string {
  const segments = [
    parts.village && `ភូមិ${parts.village}`,
    parts.commune && `ឃុំ/សង្កាត់${parts.commune}`,
    parts.district && `ស្រុក/ខណ្ឌ${parts.district}`,
    parts.province && `ខេត្ត/រាជធានី${parts.province}`,
  ].filter(Boolean);
  return segments.join(" ");
}
