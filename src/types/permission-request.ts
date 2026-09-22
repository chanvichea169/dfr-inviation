export interface PermissionRequestData {
  name: string;
  role: string;
  customRole: string;
  office: string;
  customOffice: string;
  leaveDuration: string;
  customLeaveDuration: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export type FieldKey = keyof PermissionRequestData | "madeAt";
