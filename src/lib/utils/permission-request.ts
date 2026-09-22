import type { PermissionRequestData } from "../../types/permission-request";
import {
  INPUT_CLASS,
  INVALID_INPUT_CLASS,
  VALID_INPUT_CLASS,
} from "../../constants/permission-request";

export function todayInputValue(): string {
  const now = new Date();
  const phnomPenhDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
  );
  const year = phnomPenhDate.getFullYear();
  const month = String(phnomPenhDate.getMonth() + 1).padStart(2, "0");
  const day = String(phnomPenhDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatKhmerDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

export function formatMadeAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Phnom_Penh",
  }).format(date);
}

export function getInclusiveDays(
  startDate: string,
  endDate: string,
): number | null {
  if (!startDate || !endDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const difference = end.getTime() - start.getTime();
  if (difference < 0) return null;

  return Math.floor(difference / 86_400_000) + 1;
}

export function parseNumericDuration(durationStr: string): number | null {
  if (!durationStr) return null;
  const match = durationStr.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

export function getEffectiveRole(data: PermissionRequestData): string {
  return data.role === "ផ្សេងៗ" ? data.customRole : data.role;
}

export function getEffectiveOffice(data: PermissionRequestData): string {
  return data.office === "ផ្សេងៗ" ? data.customOffice : data.office;
}

export function getEffectiveDuration(data: PermissionRequestData): string {
  return data.leaveDuration === "ផ្សេងៗ"
    ? data.customLeaveDuration
    : data.leaveDuration;
}

export function buildRequestText(
  formData: PermissionRequestData,
  madeAt: string,
): string {
  return [
    `ឈ្មោះ ៖ ${formData.name || ""}`,
    `តួនាទី ៖ ${getEffectiveRole(formData)}`,
    `ការិយាល័យ ៖ ${getEffectiveOffice(formData)}`,
    `ស្នើសុំអនុញ្ញាតច្បាប់ ៖ ${getEffectiveDuration(formData)}`,
    `ចាប់ពីថ្ងៃទី ៖ ${formatKhmerDate(formData.startDate)}`,
    `ដល់ថ្ងៃទី ៖ ${formatKhmerDate(formData.endDate)}`,
    `មូលហេតុ ៖ ${formData.reason || ""}`,
    "",
    "____________________________________",
    `ធ្វើនៅថ្ងៃទី ៖ ${madeAt}`,
  ].join("\n");
}

export function fieldClass(hasError: boolean, extra = ""): string {
  return `${INPUT_CLASS} ${hasError ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS} ${extra}`;
}
