import type { PermissionRequestData } from "../../types/permission-request";
import {
  formatKhmerDate,
  getEffectiveDuration,
  getEffectiveOffice,
  getEffectiveRole,
} from "../../lib/utils/permission-request";

interface PrintablePermissionFormProps {
  formData: PermissionRequestData;
  madeAt: string;
}

export function PrintablePermissionForm({
  formData,
  madeAt,
}: PrintablePermissionFormProps) {
  const rows = [
    ["ឈ្មោះ", formData.name],
    ["តួនាទី", getEffectiveRole(formData)],
    ["ការិយាល័យ", getEffectiveOffice(formData)],
    ["ស្នើសុំអនុញ្ញាតច្បាប់", getEffectiveDuration(formData)],
    ["ចាប់ពីថ្ងៃទី", formatKhmerDate(formData.startDate)],
    ["ដល់ថ្ងៃទី", formatKhmerDate(formData.endDate)],
    ["មូលហេតុ", formData.reason],
  ];

  return (
    <section className="print-area permission-print-form" aria-hidden="true">
      <div className="permission-print-page khmer-siemreap text-base sm:text-lg">
        <header className="permission-print-header">
          <p className="text-lg font-bold">ព្រះរាជាណាចក្រកម្ពុជា</p>
          <p className="text-lg font-bold">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
          <div className="permission-print-rule" />
        </header>

        <h1 className="text-2xl font-bold">លិខិតស្នើសុំអនុញ្ញាតច្បាប់</h1>

        <div className="permission-print-fields">
          {rows.map(([label, value]) => (
            <div className="permission-print-row" key={label}>
              <span className="permission-print-label">{label} ៖</span>
              <span className="permission-print-value">{value || " "}</span>
            </div>
          ))}
        </div>

        <footer className="permission-print-footer">
          <div>
            <div className="permission-print-date">ធ្វើនៅថ្ងៃទី ៖ {madeAt}</div>
            <div className="permission-print-signature">
              <p>ហត្ថលេខាសាមីខ្លួន</p>
              <div />
              <p>{formData.name}</p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
