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

  /*
   * Date range between start date and end date.
   * This is NOT the header total day.
   * It is only used to check whether the selected leave duration
   * fits inside the selected date range.
   */
  const totalCalendarDays = useMemo(
    () => getInclusiveDays(formData.startDate, formData.endDate),
    [formData.startDate, formData.endDate],
  );

  /*
   * Header Total Days.
   *
   * This value depends directly on the leaveDuration select.
   *
   * Example:
   * "24 ថ្ងៃ" -> 24
   * "15 ថ្ងៃ" -> 15
   * "7 ថ្ងៃ"  -> 7
   */
  const selectedTotalDays = useMemo(() => {
    const duration = getEffectiveDuration(formData);

    return parseNumericDuration(duration);
  }, [formData]);

  const durationMismatchWarning = useMemo(() => {
    if (
      totalCalendarDays !== null &&
      selectedTotalDays !== null &&
      selectedTotalDays > totalCalendarDays
    ) {
      return `ការស្នើសុំចំនួន ${selectedTotalDays} ថ្ងៃ គឺលើសពីចន្លោះថ្ងៃបរិច្ឆេទដែលបានជ្រើសរើស (សរុបមានតែ ${totalCalendarDays} ថ្ងៃប៉ុណ្ណោះ)។`;
    }

    return null;
  }, [totalCalendarDays, selectedTotalDays]);

  const validationErrors = useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!formData.name.trim()) {
      errors.name = "សូមបញ្ចូលឈ្មោះ";
    }

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

    if (!formData.startDate) {
      errors.startDate = "សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម";
    }

    if (!formData.endDate) {
      errors.endDate = "សូមជ្រើសរើសថ្ងៃបញ្ចប់";
    }

    if (formData.startDate && formData.endDate && totalCalendarDays === null) {
      errors.endDate = "ថ្ងៃបញ្ចប់ត្រូវនៅក្រោយថ្ងៃចាប់ផ្តើម";
    }

    if (!formData.reason.trim()) {
      errors.reason = "សូមបញ្ចូលមូលហេតុ";
    }

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
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "startDate" && next.endDate && value > next.endDate) {
        next.endDate = value;
      }

      if (field === "role" && value !== "ផ្សេងៗ") {
        next.customRole = "";
      }

      if (field === "office" && value !== "ផ្សេងៗ") {
        next.customOffice = "";
      }

      if (field === "leaveDuration" && value !== "ផ្សេងៗ") {
        next.customLeaveDuration = "";
      }

      return next;
    });
  };

  const markTouched = (field: FieldKey) => {
    setTouchedFields((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
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

    document.title = `permission-request-${safeName}-${currentMadeAt.replace(
      /[/:\s]/g,
      "-",
    )}`;

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
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
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
    <div className="w-full max-w-5xl mx-auto px-0 sm:px-4 lg:px-6 py-3 sm:py-8">
      <form onSubmit={handleSubmit}>
        <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_8px_40px_-16px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
          {/* Header */}
          <div className="relative overflow-hidden border-b border-slate-200/80 px-4 py-5 sm:px-7 sm:py-6 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/20" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <FileText size={21} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                    លិខិតស្នើសុំអនុញ្ញាតច្បាប់
                  </h2>

                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                    ព័ត៌មានស្នើសុំ និងការផ្ទៀងផ្ទាត់មុនបញ្ជូន
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                  <Clock size={13} />
                  {selectedTotalDays !== null
                    ? `${selectedTotalDays} ថ្ងៃ`
                    : "មិនទាន់កំណត់"}
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                    hasErrors || Boolean(durationMismatchWarning)
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasErrors || Boolean(durationMismatchWarning)
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  {hasErrors || Boolean(durationMismatchWarning)
                    ? "ត្រូវពិនិត្យ"
                    : "រួចរាល់"}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  ឈ្មោះ <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="បញ្ចូលឈ្មោះ..."
                    autoComplete="name"
                    className={fieldClass(
                      Boolean(getError("name")),
                      "h-12 pl-11 pr-4 rounded-xl border-slate-200 bg-slate-50/70 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800",
                    )}
                    value={formData.name}
                    onBlur={() => markTouched("name")}
                    onChange={(event) => updateData("name", event.target.value)}
                  />
                </div>

                <FieldError message={getError("name")} />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  តួនាទី <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="role"
                    className={fieldClass(
                      Boolean(getError("role")),
                      "h-12 pl-11 pr-11 appearance-none cursor-pointer rounded-xl border-slate-200 bg-slate-50/70 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800",
                    )}
                    value={formData.role}
                    onBlur={() => markTouched("role")}
                    onChange={(event) => updateData("role", event.target.value)}
                  >
                    <option value="" disabled>
                      ជ្រើសរើសតួនាទី
                    </option>

                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <FieldError message={getError("role")} />
              </div>

              {/* Custom Role */}
              {formData.role === "ផ្សេងៗ" && (
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="customRole"
                    className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    បញ្ជាក់តួនាទីផ្សេងៗ <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="customRole"
                    type="text"
                    placeholder="សូមបញ្ចូលតួនាទីផ្សេងៗ..."
                    className={fieldClass(
                      Boolean(getError("customRole")),
                      "h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50",
                    )}
                    value={formData.customRole}
                    onBlur={() => markTouched("customRole")}
                    onChange={(event) =>
                      updateData("customRole", event.target.value)
                    }
                  />

                  <FieldError message={getError("customRole")} />
                </div>
              )}

              {/* Office */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="office"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  ការិយាល័យ <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="office"
                    className={fieldClass(
                      Boolean(getError("office")),
                      "h-12 pl-11 pr-11 appearance-none cursor-pointer rounded-xl border-slate-200 bg-slate-50/70 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800",
                    )}
                    value={formData.office}
                    onBlur={() => markTouched("office")}
                    onChange={(event) =>
                      updateData("office", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      ជ្រើសរើសការិយាល័យ
                    </option>

                    {OFFICES.map((office) => (
                      <option key={office} value={office}>
                        {office}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <FieldError message={getError("office")} />

                {formData.office === "ផ្សេងៗ" && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="សូមបញ្ចូលការិយាល័យផ្សេងៗ..."
                      className={fieldClass(
                        Boolean(getError("customOffice")),
                        "h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50",
                      )}
                      value={formData.customOffice}
                      onBlur={() => markTouched("customOffice")}
                      onChange={(event) =>
                        updateData("customOffice", event.target.value)
                      }
                    />

                    <FieldError message={getError("customOffice")} />
                  </div>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="leaveDuration"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  ស្នើសុំអនុញ្ញាតច្បាប់ (ចំនួនថ្ងៃ){" "}
                  <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="leaveDuration"
                    className={fieldClass(
                      Boolean(getError("leaveDuration")),
                      "h-12 pl-11 pr-11 appearance-none cursor-pointer rounded-xl border-slate-200 bg-slate-50/70 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800",
                    )}
                    value={formData.leaveDuration}
                    onBlur={() => markTouched("leaveDuration")}
                    onChange={(event) =>
                      updateData("leaveDuration", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      ជ្រើសរើសចំនួនថ្ងៃ/រយៈពេល
                    </option>

                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <FieldError message={getError("leaveDuration")} />

                {formData.leaveDuration === "ផ្សេងៗ" && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="សូមបញ្ជាក់រយៈពេលផ្សេងៗ..."
                      className={fieldClass(
                        Boolean(getError("customLeaveDuration")),
                        "h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50",
                      )}
                      value={formData.customLeaveDuration}
                      onBlur={() => markTouched("customLeaveDuration")}
                      onChange={(event) =>
                        updateData("customLeaveDuration", event.target.value)
                      }
                    />

                    <FieldError message={getError("customLeaveDuration")} />
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="sm:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Calendar size={15} />
                  </div>

                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    រយៈពេលស្នើសុំ
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Start */}
                  <div className="space-y-2">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                      ចាប់ពីថ្ងៃទី <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <Calendar
                        size={18}
                        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="startDate"
                        type="date"
                        className={fieldClass(
                          Boolean(getError("startDate")),
                          "h-12 w-full cursor-pointer appearance-none rounded-xl bg-slate-50/70 pl-11 pr-4 dark:bg-slate-800/50",
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

                  {/* End */}
                  <div className="space-y-2">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                      ដល់ថ្ងៃទី <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <Calendar
                        size={18}
                        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="endDate"
                        type="date"
                        min={formData.startDate}
                        className={fieldClass(
                          Boolean(getError("endDate")),
                          "h-12 w-full cursor-pointer appearance-none rounded-xl bg-slate-50/70 pl-11 pr-4 dark:bg-slate-800/50",
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
                </div>
              </div>

              {/* Warning */}
              {durationMismatchWarning && (
                <div className="sm:col-span-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3.5 text-sm text-amber-800 dark:border-amber-800/60 dark:from-amber-950/30 dark:to-orange-950/20 dark:text-amber-300">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />

                    <span className="leading-relaxed">
                      {durationMismatchWarning}
                    </span>
                  </div>
                </div>
              )}

              {/* Made At */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="madeAt"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  ធ្វើនៅថ្ងៃទី
                </label>

                <input
                  id="madeAt"
                  type="text"
                  disabled
                  className={fieldClass(
                    false,
                    "h-12 rounded-xl bg-slate-100/80 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400",
                  )}
                  value={madeAt}
                />
              </div>

              {/* Reason */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    មូលហេតុ <span className="text-rose-500">*</span>
                  </label>

                  <span className="text-xs font-medium text-slate-400">
                    {formData.reason.trim().length} តួអក្សរ
                  </span>
                </div>

                <textarea
                  id="reason"
                  rows={4}
                  placeholder="បញ្ចូលមូលហេតុស្នើសុំច្បាប់..."
                  className={fieldClass(
                    Boolean(getError("reason")),
                    "min-h-32 resize-none rounded-2xl bg-slate-50/70 py-3.5 leading-relaxed transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:bg-slate-800/50 dark:focus:bg-slate-800",
                  )}
                  value={formData.reason}
                  onBlur={() => markTouched("reason")}
                  onChange={(event) => updateData("reason", event.target.value)}
                />

                <FieldError message={getError("reason")} />
              </div>
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/30 dark:text-rose-300">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <span className="leading-relaxed">{submitError}</span>
              </div>
            )}

            {/* Submit */}
            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:h-13 sm:text-base"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {isSubmitting ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    <span>កំពុងបញ្ជូន...</span>
                  </>
                ) : (
                  <>
                    <Send
                      size={19}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
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
