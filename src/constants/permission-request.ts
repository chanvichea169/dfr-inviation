import type { PermissionRequestData } from "../types/permission-request";

export const ROLES = [
  "ប្រធាននាយកដ្ឋាន",
  "អនុប្រធាននាយកដ្ឋាន",
  "ប្រធានការិយាល័យ",
  "អនុប្រធានការិយាល័យ",
  "មន្រ្តី",
  "មន្រ្តីកិច្ចសន្យា",
  "បុគ្គលិកកិច្ចសន្យា",
  "មន្រ្តីហាត់ការ",
  "មន្រ្តីស្ម័គ្រចិត្ត",
  "ផ្សេងៗ",
];

export const OFFICES = [
  "ការិយាល័យរដ្ឋបាល",
  "ការិយាល័យកិច្ចការច្រកចេញចូលតែមួយ",
  "ការិយាល័យមុខងារ",
  "ការិយាល័យប្រជាពលរដ្ឋ(ME)",
  "ផ្សេងៗ",
];

export const DURATION_OPTIONS = [
  "0.5 ថ្ងៃ (កន្លះថ្ងៃ)",
  "1 ថ្ងៃ",
  "2 ថ្ងៃ",
  "3 ថ្ងៃ",
  "4 ថ្ងៃ",
  "5 ថ្ងៃ",
  "6 ថ្ងៃ",
  "7 ថ្ងៃ (1 សប្តាហ៍)",
  "ផ្សេងៗ",
];

export const EMPTY_FORM_DATA: PermissionRequestData = {
  name: "",
  role: "",
  customRole: "",
  office: "",
  customOffice: "",
  leaveDuration: "",
  customLeaveDuration: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export const INPUT_CLASS =
  "w-full h-11 sm:h-12 rounded-xl border bg-white px-4 py-2.5 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

export const VALID_INPUT_CLASS =
  "border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-sky-500/15";

export const INVALID_INPUT_CLASS =
  "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/15";
