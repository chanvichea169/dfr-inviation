"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  Loader2,
  Send,
  User,
} from "lucide-react";
import type {
  FieldKey,
  PermissionRequestData,
} from "../../types/permission-request";
import {
  DURATION_OPTIONS,
  EMPTY_FORM_DATA,
  OFFICES,
  ROLES,
} from "../../constants/permission-request";
import {
  buildRequestText,
  fieldClass,
  formatKhmerDate,
  formatMadeAt,
  getEffectiveDuration,
  getEffectiveOffice,
  getEffectiveRole,
  getInclusiveDays,
  parseNumericDuration,
  todayInputValue,
} from "../../lib/utils/permission-request";
import { FieldError } from "./FieldError";
import { SuccessView } from "./SuccessView";

export default function PermissionRequestForm() {
  const [formData, setFormData] = useState<PermissionRequestData>({
    ...EMPTY_FORM_DATA,
    startDate: todayInputValue(),
    endDate: todayInputValue(),
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

  const totalCalendarDays = useMemo(
    () => getInclusiveDays(formData.startDate, formData.endDate),
    [formData.startDate, formData.endDate],
  );

  const selectedDurationDays = useMemo(
    () => parseNumericDuration(getEffectiveDuration(formData)),
    [formData],
  );

  const durationMismatchWarning = useMemo(() => {
    if (
      totalCalendarDays !== null &&
      selectedDurationDays !== null &&
      selectedDurationDays > totalCalendarDays
    ) {
      return `ការស្នើសុំចំនួន ${selectedDurationDays} ថ្ងៃ គឺលើសពីចន្លោះថ្ងៃបរិច្ឆេទដែលបានជ្រើសរើស (សរុបមានតែ ${totalCalendarDays} ថ្ងៃប៉ុណ្ណោះ)។`;
    }
    return null;
  }, [totalCalendarDays, selectedDurationDays]);

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!formData.name.trim()) errors.name = "សូមបញ្ចូលឈ្មោះ";

    if (!formData.role) {
      errors.role = "សូមជ្រើសរើសតួនាទី";
    } else if (formData.role === "ផ្សេងៗ" && !formData.customRole.trim()) {
      errors.customRole = "សូមបញ្ចូលតួនាទីផ្សេងៗ";
    }

    if (!formData.office) {
      errors.office = "សូមជ្រើសរើសការិយាល័យ";
    } else if (formData.office === "ផ្សេងៗ" && !formData.customOffice.trim()) {
      errors.customOffice = "សូមបញ្ចូលការិយាល័យផ្សេងៗ";
    }

    if (!formData.leaveDuration) {
      errors.leaveDuration = "សូមជ្រើសរើសរយៈពេលច្បាប់";
    } else if (
      formData.leaveDuration === "ផ្សេងៗ" &&
      !formData.customLeaveDuration.trim()
    ) {
      errors.customLeaveDuration = "សូមបញ្ចូលរយៈពេលផ្សេងៗ";
    }

    if (!formData.startDate) errors.startDate = "សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម";
    if (!formData.endDate) errors.endDate = "សូមជ្រើសរើសថ្ងៃបញ្ចប់";

    if (formData.startDate && formData.endDate && totalCalendarDays === null) {
      errors.endDate = "ថ្ងៃបញ្ចប់ត្រូវនៅក្រោយថ្ងៃចាប់ផ្តើម";
    }

    if (!formData.reason.trim()) errors.reason = "សូមបញ្ចូលមូលហេតុ";

    return errors;
  }, [formData, totalCalendarDays]);

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
    setFormData({
      ...EMPTY_FORM_DATA,
      startDate: todayInputValue(),
      endDate: todayInputValue(),
    });
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
      role: getEffectiveRole(formData),
      office: getEffectiveOffice(formData),
      leaveDuration: getEffectiveDuration(formData),
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
      <SuccessView
        permissionText={permissionText}
        formData={formData}
        madeAt={madeAt}
        onDownloadPdf={handleDownloadPdf}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6 sm:py-8">
      <form onSubmit={handleSubmit}>
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                  លិខិតស្នើសុំអនុញ្ញាតច្បាប់
                </h2>
                <p className="text-sm sm:text-base text-slate-500">
                  ព័ត៌មានស្នើសុំ និងការផ្ទៀងផ្ទាត់មុនបញ្ជូន
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 shadow-2xs">
                {totalCalendarDays
                  ? `${totalCalendarDays} ថ្ងៃ`
                  : "មិនទាន់កំណត់"}
              </span>
              <span
                className={`rounded-full border px-3 py-1 ${
                  hasErrors || Boolean(durationMismatchWarning)
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {hasErrors || Boolean(durationMismatchWarning)
                  ? "ត្រូវពិនិត្យ"
                  : "រួចរាល់"}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* ឈ្មោះ */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  ឈ្មោះ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="name"
                    type="text"
                    placeholder="បញ្ចូលឈ្មោះ..."
                    autoComplete="name"
                    className={fieldClass(Boolean(getError("name")), "pl-10")}
                    value={formData.name}
                    onBlur={() => markTouched("name")}
                    onChange={(event) => updateData("name", event.target.value)}
                  />
                </div>
                <FieldError message={getError("name")} />
              </div>

              {/* តួនាទី */}
              <div className="space-y-1.5">
                <label
                  htmlFor="role"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  តួនាទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    id="role"
                    className={fieldClass(
                      Boolean(getError("role")),
                      "pl-10 pr-10 appearance-none cursor-pointer",
                    )}
                    value={formData.role}
                    onBlur={() => markTouched("role")}
                    onChange={(event) => updateData("role", event.target.value)}
                  >
                    <option value="" disabled>
                      -- ជ្រើសរើសតួនាទី --
                    </option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
                <FieldError message={getError("role")} />

                {formData.role === "ផ្សេងៗ" && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      placeholder="សូមបញ្ចូលតួនាទីផ្សេងៗ..."
                      className={fieldClass(Boolean(getError("customRole")))}
                      value={formData.customRole}
                      onBlur={() => markTouched("customRole")}
                      onChange={(e) => updateData("customRole", e.target.value)}
                    />
                    <FieldError message={getError("customRole")} />
                  </div>
                )}
              </div>

              {/* ការិយាល័យ */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="office"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  ការិយាល័យ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    id="office"
                    className={fieldClass(
                      Boolean(getError("office")),
                      "pl-10 pr-10 appearance-none cursor-pointer",
                    )}
                    value={formData.office}
                    onBlur={() => markTouched("office")}
                    onChange={(event) =>
                      updateData("office", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      -- ជ្រើសរើសការិយាល័យ --
                    </option>
                    {OFFICES.map((office) => (
                      <option key={office} value={office}>
                        {office}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
                <FieldError message={getError("office")} />

                {formData.office === "ផ្សេងៗ" && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      placeholder="សូមបញ្ចូលការិយាល័យផ្សេងៗ..."
                      className={fieldClass(Boolean(getError("customOffice")))}
                      value={formData.customOffice}
                      onBlur={() => markTouched("customOffice")}
                      onChange={(e) =>
                        updateData("customOffice", e.target.value)
                      }
                    />
                    <FieldError message={getError("customOffice")} />
                  </div>
                )}
              </div>

              {/* ស្នើសុំអនុញ្ញាតច្បាប់ (Dropdown Select) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="leaveDuration"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  ស្នើសុំអនុញ្ញាតច្បាប់ (ចំនួនថ្ងៃ){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    id="leaveDuration"
                    className={fieldClass(
                      Boolean(getError("leaveDuration")),
                      "pl-10 pr-10 appearance-none cursor-pointer",
                    )}
                    value={formData.leaveDuration}
                    onBlur={() => markTouched("leaveDuration")}
                    onChange={(event) =>
                      updateData("leaveDuration", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      -- ជ្រើសរើសចំនួនថ្ងៃ/រយៈពេល --
                    </option>
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
                <FieldError message={getError("leaveDuration")} />

                {formData.leaveDuration === "ផ្សេងៗ" && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      placeholder="សូមបញ្ជាក់រយៈពេលផ្សេងៗ (ឧទាហរណ៍ 10 ថ្ងៃ)..."
                      className={fieldClass(
                        Boolean(getError("customLeaveDuration")),
                      )}
                      value={formData.customLeaveDuration}
                      onBlur={() => markTouched("customLeaveDuration")}
                      onChange={(e) =>
                        updateData("customLeaveDuration", e.target.value)
                      }
                    />
                    <FieldError message={getError("customLeaveDuration")} />
                  </div>
                )}
              </div>

              {/* ចាប់ពីថ្ងៃទី */}
              <div className="space-y-1.5">
                <label
                  htmlFor="startDate"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  ចាប់ពីថ្ងៃទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    id="startDate"
                    type="date"
                    className={fieldClass(
                      Boolean(getError("startDate")),
                      "pl-10",
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

              {/* ដល់ថ្ងៃទី */}
              <div className="space-y-1.5">
                <label
                  htmlFor="endDate"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  ដល់ថ្ងៃទី <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    id="endDate"
                    type="date"
                    min={formData.startDate}
                    className={fieldClass(
                      Boolean(getError("endDate")),
                      "pl-10",
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

              {/* Duration Mismatch Warning */}
              {durationMismatchWarning && (
                <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 flex items-start gap-2.5 text-amber-800 text-sm">
                  <AlertTriangle
                    size={18}
                    className="shrink-0 mt-0.5 text-amber-600"
                  />
                  <span>{durationMismatchWarning}</span>
                </div>
              )}

              {/* ធ្វើនៅថ្ងៃទី */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="madeAt"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
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

              {/* មូលហេតុ */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="reason"
                  className="block text-sm sm:text-base font-semibold text-slate-700"
                >
                  មូលហេតុ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  placeholder="បញ្ចូលមូលហេតុស្នើសុំច្បាប់..."
                  className={fieldClass(
                    Boolean(getError("reason")),
                    "h-auto py-3 resize-none leading-relaxed",
                  )}
                  value={formData.reason}
                  onBlur={() => markTouched("reason")}
                  onChange={(event) => updateData("reason", event.target.value)}
                />
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500 pt-0.5">
                  <FieldError message={getError("reason")} />
                  <span className="ml-auto font-siemreab text-sm text-slate-500">
                    {formData.reason ? formData.reason.trim().length : 0}{" "}
                    តួអក្សរ
                  </span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-11 sm:h-12 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:from-sky-700 hover:to-sky-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>កំពុងបញ្ជូន...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>បញ្ជូនសំណើ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
