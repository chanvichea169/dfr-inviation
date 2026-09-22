"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  Send,
  User,
} from "lucide-react";

interface PermissionRequestData {
  name: string;
  role: string;
  office: string;
  leaveDuration: string;
  startDate: string;
  endDate: string;
  reason: string;
}

type FieldKey = keyof PermissionRequestData | "madeAt";

const DEFAULT_FORM_DATA: PermissionRequestData = {
  name: "សុគន្ធ សុធាវី",
  role: "មន្រ្តីហាត់ការ",
  office: "ការិយាល័យកិច្ចការច្រកចេញចូលតែមួយ",
  leaveDuration: "1 ថ្ងៃ",
  startDate: "2026-09-21",
  endDate: "2026-09-21",
  reason:
    "ចូលរួមកម្មវិធីសំណេះសំណាលអាហារូបករណ៍ នៅនាយកដ្ឋានអភិវឌ្ឍ ក្រសួងការពារជាតិ(ធ្វើជាអាណាព្យាបាលប្អូន)",
};

const QUICK_DURATIONS = [
  "កន្លះថ្ងៃ",
  "1 ថ្ងៃ",
  "2 ថ្ងៃ",
  "3 ថ្ងៃ",
  "1 សប្តាហ៍",
];

const INPUT_CLASS =
  "w-full min-h-13 rounded-xl border bg-white px-4 py-3.5 text-base sm:text-lg text-slate-900 shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
const VALID_INPUT_CLASS =
  "border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-sky-500/15";
const INVALID_INPUT_CLASS =
  "border-rose-300 bg-rose-50/60 focus:border-rose-500 focus:ring-rose-500/15";

function todayInputValue(): string {
  const now = new Date();
  const phnomPenhDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
  );
  const year = phnomPenhDate.getFullYear();
  const month = String(phnomPenhDate.getMonth() + 1).padStart(2, "0");
  const day = String(phnomPenhDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatKhmerDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

function formatMadeAt(date: Date): string {
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

function getInclusiveDays(startDate: string, endDate: string): number | null {
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

function buildRequestText(
  formData: PermissionRequestData,
  madeAt: string,
): string {
  return [
    `ឈ្មោះ ៖ ${formData.name || ""}`,
    `តួនាទី ៖ ${formData.role || ""}`,
    `ការិយាល័យ ៖ ${formData.office || ""}`,
    `ស្នើសុំអនុញ្ញាតច្បាប់ ៖ ${formData.leaveDuration || ""}`,
    `ចាប់ពីថ្ងៃទី ៖ ${formatKhmerDate(formData.startDate)}`,
    `ដល់ថ្ងៃទី ៖ ${formatKhmerDate(formData.endDate)}`,
    `មូលហេតុ ៖ ${formData.reason || ""}`,
    "",
    "____________________________________",
    `ធ្វើនៅថ្ងៃទី ៖ ${madeAt}`,
  ].join("\n");
}

function PrintablePermissionForm({
  formData,
  madeAt,
}: {
  formData: PermissionRequestData;
  madeAt: string;
}) {
  const rows = [
    ["ឈ្មោះ", formData.name],
    ["តួនាទី", formData.role],
    ["ការិយាល័យ", formData.office],
    ["ស្នើសុំអនុញ្ញាតច្បាប់", formData.leaveDuration],
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-rose-600 mt-1">{message}</p>;
}

function fieldClass(hasError: boolean, extra = ""): string {
  return `${INPUT_CLASS} ${hasError ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS} ${extra}`;
}

export default function PermissionRequestForm() {
  const [formData, setFormData] = useState<PermissionRequestData>({
    ...DEFAULT_FORM_DATA,
    startDate: DEFAULT_FORM_DATA.startDate || todayInputValue(),
    endDate: DEFAULT_FORM_DATA.endDate || todayInputValue(),
  });
  const [madeAt, setMadeAt] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<FieldKey>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setMadeAt(formatMadeAt(new Date()));
  }, []);

  const inclusiveDays = useMemo(
    () => getInclusiveDays(formData.startDate, formData.endDate),
    [formData.startDate, formData.endDate],
  );

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!formData.name.trim()) errors.name = "សូមបញ្ចូលឈ្មោះ";
    if (!formData.role.trim()) errors.role = "សូមបញ្ចូលតួនាទី";
    if (!formData.office.trim()) errors.office = "សូមបញ្ចូលការិយាល័យ";
    if (!formData.leaveDuration.trim())
      errors.leaveDuration = "សូមបញ្ចូលរយៈពេលច្បាប់";
    if (!formData.startDate) errors.startDate = "សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម";
    if (!formData.endDate) errors.endDate = "សូមជ្រើសរើសថ្ងៃបញ្ចប់";

    if (formData.startDate && formData.endDate && !inclusiveDays) {
      errors.endDate = "ថ្ងៃបញ្ចប់ត្រូវនៅក្រោយថ្ងៃចាប់ផ្តើម";
    }

    if (!formData.reason.trim()) errors.reason = "សូមបញ្ចូលមូលហេតុ";

    return errors;
  }, [formData, inclusiveDays]);

  const hasErrors = Object.keys(validationErrors).length > 0;
  const permissionText = useMemo(
    () => buildRequestText(formData, madeAt),
    [formData, madeAt],
  );

  const shouldShowError = (field: FieldKey) =>
    submitAttempted || touchedFields.has(field);

  const getError = (field: FieldKey) =>
    shouldShowError(field) ? validationErrors[field] : undefined;

  const updateData = <K extends keyof PermissionRequestData>(
    field: K,
    value: PermissionRequestData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "startDate" && next.endDate && value > next.endDate) {
        next.endDate = value;
      }
      return next;
    });
  };

  const markTouched = (field: FieldKey) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const refreshMadeAt = () => {
    const nextMadeAt = formatMadeAt(new Date());
    setMadeAt(nextMadeAt);
    return nextMadeAt;
  };

  const handleDownloadPdf = () => {
    const currentMadeAt = refreshMadeAt();
    const originalTitle = document.title;
    const safeName = (formData.name || "permission-request")
      .trim()
      .replace(/\s+/g, "-");

    document.title = `permission-request-${safeName}-${currentMadeAt.replace(/[/:\s]/g, "-")}`;
    window.print();

    window.setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setMadeAt(formatMadeAt(new Date()));
    setIsSubmitted(false);
    setSubmitError(null);
    setTouchedFields(new Set());
    setSubmitAttempted(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (hasErrors) {
      setSubmitError("សូមពិនិត្យ និងបំពេញព័ត៌មានដែលត្រូវការ។");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const currentMadeAt = refreshMadeAt();
    const requestText = buildRequestText(formData, currentMadeAt);
    const payload = {
      ...formData,
      startDate: formatKhmerDate(formData.startDate),
      endDate: formatKhmerDate(formData.endDate),
      madeAt: currentMadeAt,
      requestText,
    };

    try {
      const res = await fetch("/api/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.telegramSent) {
        throw new Error(
          data.telegramError ||
            "Permission request saved, but Telegram notification was not sent.",
        );
      }

      setIsSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "មិនអាចរក្សាទុកទិន្នន័យបានទេ។ សូមព្យាយាមម្ដងទៀត។";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 sm:p-10 text-center print-hide"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            បានបញ្ជូនជោគជ័យ!
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
            លិខិតស្នើសុំអនុញ្ញាតច្បាប់ត្រូវបានរក្សាទុក និងផ្ញើជូនរួចរាល់។
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-6">
            <pre className="khmer-siemreap whitespace-pre-wrap break-words text-base sm:text-lg leading-8 text-slate-800 font-normal">
              {permissionText}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full min-h-13 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Download size={20} /> ទាញយកជា PDF
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full min-h-13 px-6 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-base rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> បង្កើតថ្មីម្ដងទៀត
            </button>
          </div>
        </motion.div>

        <PrintablePermissionForm formData={formData} madeAt={madeAt} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <form onSubmit={handleSubmit}>
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/70 px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                  លិខិតស្នើសុំអនុញ្ញាតច្បាប់
                </h2>
                <p className="text-base text-slate-500">
                  ព័ត៌មានស្នើសុំ និងការផ្ទៀងផ្ទាត់មុនបញ្ជូន
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <span className="rounded-full bg-white border border-slate-200 px-3.5 py-1.5">
                {inclusiveDays ? `${inclusiveDays} ថ្ងៃ` : "មិនទាន់កំណត់"}
              </span>
              <span
                className={`rounded-full border px-3.5 py-1.5 ${hasErrors ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
              >
                {hasErrors ? "ត្រូវពិនិត្យ" : "រួចរាល់"}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-slate-700"
                >
                  ឈ្មោះ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={fieldClass(Boolean(getError("name")), "pl-11")}
                    value={formData.name}
                    onBlur={() => markTouched("name")}
                    onChange={(event) => updateData("name", event.target.value)}
                  />
                </div>
                <FieldError message={getError("name")} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-base font-semibold text-slate-700"
                >
                  តួនាទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    id="role"
                    type="text"
                    className={fieldClass(Boolean(getError("role")), "pl-11")}
                    value={formData.role}
                    onBlur={() => markTouched("role")}
                    onChange={(event) => updateData("role", event.target.value)}
                  />
                </div>
                <FieldError message={getError("role")} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="office"
                  className="block text-base font-semibold text-slate-700"
                >
                  ការិយាល័យ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    id="office"
                    type="text"
                    className={fieldClass(Boolean(getError("office")), "pl-11")}
                    value={formData.office}
                    onBlur={() => markTouched("office")}
                    onChange={(event) =>
                      updateData("office", event.target.value)
                    }
                  />
                </div>
                <FieldError message={getError("office")} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="leaveDuration"
                  className="block text-base font-semibold text-slate-700"
                >
                  ស្នើសុំអនុញ្ញាតច្បាប់ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    id="leaveDuration"
                    type="text"
                    className={fieldClass(
                      Boolean(getError("leaveDuration")),
                      "pl-11",
                    )}
                    value={formData.leaveDuration}
                    onBlur={() => markTouched("leaveDuration")}
                    onChange={(event) =>
                      updateData("leaveDuration", event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_DURATIONS.map((duration) => (
                    <button
                      type="button"
                      key={duration}
                      onClick={() => updateData("leaveDuration", duration)}
                      className={`min-h-10 rounded-lg border px-3.5 text-sm font-semibold transition ${formData.leaveDuration === duration ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
                <FieldError message={getError("leaveDuration")} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="block text-base font-semibold text-slate-700"
                >
                  ចាប់ពីថ្ងៃទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                  <input
                    id="startDate"
                    type="date"
                    className={fieldClass(
                      Boolean(getError("startDate")),
                      "pl-11",
                    )}
                    value={formData.startDate}
                    onBlur={() => markTouched("startDate")}
                    onChange={(event) =>
                      updateData("startDate", event.target.value)
                    }
                  />
                </div>
                <FieldError message={getError("startDate")} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="block text-base font-semibold text-slate-700"
                >
                  ដល់ថ្ងៃទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                  <input
                    id="endDate"
                    type="date"
                    min={formData.startDate}
                    className={fieldClass(
                      Boolean(getError("endDate")),
                      "pl-11",
                    )}
                    value={formData.endDate}
                    onBlur={() => markTouched("endDate")}
                    onChange={(event) =>
                      updateData("endDate", event.target.value)
                    }
                  />
                </div>
                <FieldError message={getError("endDate")} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="madeAt"
                  className="block text-base font-semibold text-slate-700"
                >
                  ធ្វើនៅថ្ងៃទី
                </label>
                <input
                  id="madeAt"
                  type="text"
                  className={fieldClass(false)}
                  value={madeAt}
                  onBlur={() => markTouched("madeAt")}
                  onChange={(event) => setMadeAt(event.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="reason"
                  className="block text-base font-semibold text-slate-700"
                >
                  មូលហេតុ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  className={fieldClass(
                    Boolean(getError("reason")),
                    "resize-none leading-8",
                  )}
                  value={formData.reason}
                  onBlur={() => markTouched("reason")}
                  onChange={(event) => updateData("reason", event.target.value)}
                />
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <FieldError message={getError("reason")} />
                  <span className="ml-auto">
                    {formData.reason.trim().length} តួអក្សរ
                  </span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2.5 text-rose-700 text-base">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 min-h-12 rounded-xl bg-sky-600 px-6 text-base font-semibold text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />{" "}
                    កំពុងបញ្ជូន...
                  </>
                ) : (
                  <>
                    <Send size={20} /> បញ្ជូនសំណើ
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full sm:flex-1 min-h-12 rounded-xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Download size={20} /> ទាញយកជា PDF
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto min-h-12 rounded-xl border border-slate-200 bg-white px-6 text-base font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> សម្អាត
              </button>
            </div>
          </div>
        </section>
      </form>

      <PrintablePermissionForm formData={formData} madeAt={madeAt} />
    </div>
  );
}
