"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
  Clock,
  Building2,
  Download,
  RotateCcw,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Props } from "../interfaces/location";

interface InvitationData {
  title: string;
  description: string;
  date: string;
  time: string;
  province: string;
  district: string;
  commune: string;
  village: string;
}

export default function InvitationForm({
  provinces = [],
  districts = [],
  communes = [],
  villages = [],
}: Props) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<InvitationData>({
    title: "សន្និសីទស្ដីពីការគ្រប់គ្រងធនធានរដ្ឋបាល ២០២៦",
    description:
      "គោលបំណងនៃកម្មវិធីនេះគឺដើម្បីពង្រឹងសមត្ថភាពមន្ត្រីរាជការក្នុងការប្រើប្រាស់ប្រព័ន្ធបច្ចេកវិទ្យាទំនើប។",
    date: "2026-08-15",
    time: "08:30",
    province: "",
    district: "",
    commune: "",
    village: "",
  });

  const [manualFields, setManualFields] = useState({
    district: false,
    commune: false,
    village: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateData = (field: keyof InvitationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleManual = (field: "district" | "commune" | "village") => {
    setManualFields((prev) => ({ ...prev, [field]: !prev[field] }));
    updateData(field, "");
    if (field === "district") {
      setManualFields((p) => ({ ...p, commune: false, village: false }));
      updateData("commune", "");
      updateData("village", "");
    } else if (field === "commune") {
      setManualFields((p) => ({ ...p, village: false }));
      updateData("village", "");
    }
  };

  const districtList = useMemo(() => {
    return districts.filter(
      (d) =>
        String(d.province_code).trim() === String(formData.province).trim(),
    );
  }, [formData.province, districts]);

  const communeList = useMemo(() => {
    return communes.filter(
      (c) => Number(c.district_code) === Number(formData.district),
    );
  }, [formData.district, communes]);

  const villageList = useMemo(() => {
    return villages.filter(
      (v) => Number(v.commune_code) === Number(formData.commune),
    );
  }, [formData.commune, villages]);

  const steps = [
    { id: 1, name: "ព័ត៌មាន", icon: FileText, desc: "ឈ្មោះ និងការពិពណ៌នា" },
    { id: 2, name: "ទីតាំង", icon: MapPin, desc: "អាសយដ្ឋានរដ្ឋបាល" },
    { id: 3, name: "កាលបរិច្ឆេទ", icon: Calendar, desc: "ថ្ងៃ និងពេលវេលា" },
    {
      id: 4,
      name: "ពិនិត្យ",
      icon: CheckCircle,
      desc: "ផ្ទៀងផ្ទាត់ និងបង្កើត",
    },
  ];

  const getProvinceName = () =>
    provinces.find((p) => String(p.province_code) === formData.province)
      ?.province_kh || formData.province;
  const getDistrictName = () =>
    districts.find((d) => String(d.district_code) === formData.district)
      ?.district_kh || formData.district;
  const getCommuneName = () =>
    communes.find((c) => String(c.commune_code) === formData.commune)
      ?.commune_kh || formData.commune;
  const getVillageName = () =>
    villages.find((v) => String(v.village_code) === formData.village)
      ?.village_kh || formData.village;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Send readable Khmer names to the sheet, not the numeric codes.
    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      province: getProvinceName(),
      district: getDistrictName(),
      commune: getCommuneName(),
      village: getVillageName(),
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

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.message || "មិនអាចរក្សាទុកទិន្នន័យបានទេ។ សូមព្យាយាមម្ដងទៀត។",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 text-center border border-sky-500/10 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-sky-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/30"
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            បង្កើតបានជោគជ័យ!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            លិខិតអញ្ជើញរបស់អ្នកត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធរួចរាល់ហើយ។
            អ្នកអាចទាញយកជាឯកសារ PDF ឬចែករំលែកដោយផ្ទាល់។
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
              <Download size={18} /> ទាញយកជា PDF
            </button>
            <button
              onClick={() => {
                setStep(1);
                setIsSubmitted(false);
                setSubmitError(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> បង្កើតថ្មីម្ដងទៀត
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Visual Stepper Container */}
      <div className="mb-8 px-2 sm:px-4">
        <div className="grid grid-cols-4 gap-1 sm:gap-2 relative">
          <div className="absolute top-5 sm:top-6 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 -z-0" />
          <motion.div
            className="absolute top-5 sm:top-6 left-[12.5%] h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 -z-0"
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 75}%` }}
            transition={{ duration: 0.3 }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div
                key={s.id}
                className="flex flex-col items-center relative z-10"
              >
                <button
                  onClick={() => {
                    if (isCompleted) {
                      setDirection(s.id < step ? -1 : 1);
                      setStep(s.id);
                    }
                  }}
                  disabled={!isCompleted && !isActive}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 font-semibold ${
                    isActive
                      ? "bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 scale-105 sm:scale-110"
                      : isCompleted
                        ? "bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer"
                        : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="text-center mt-2 sm:mt-3">
                  <p
                    className={`text-[11px] sm:text-xs font-bold tracking-wide transition-colors line-clamp-1 ${isActive ? "text-sky-700" : isCompleted ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {s.name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.06)] overflow-hidden flex flex-col min-h-[480px] sm:min-h-[520px]">
        <div className="p-4 sm:p-8 md:p-10 flex-grow relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full"
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="p-2.5 sm:p-3 bg-sky-50 text-sky-600 rounded-xl sm:rounded-2xl border border-sky-100">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        ព័ត៌មានកម្មវិធី
                      </h2>
                      <p className="text-xs text-slate-500">
                        បំពេញឈ្មោះ និងការពិពណ៌នាអំពីកម្មវិធីរបស់អ្នក
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        ចំណងជើងកម្មវិធី <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all"
                        placeholder="ឧទាហរណ៍៖ សន្និសីទប្រចាំឆ្នាំ..."
                        value={formData.title}
                        onChange={(e) => updateData("title", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        ការពិពណ៌នាសង្ខេប
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all resize-none"
                        placeholder="រៀបរាប់អំពីគោលបំណងនៃកម្មវិធី..."
                        value={formData.description}
                        onChange={(e) =>
                          updateData("description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="p-2.5 sm:p-3 bg-sky-50 text-sky-600 rounded-xl sm:rounded-2xl border border-sky-100">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        ទីតាំងប្រារព្ធកម្មវិធី
                      </h2>
                      <p className="text-xs text-slate-500">
                        ជ្រើសរើសទីតាំងរដ្ឋបាល ឬវាយបញ្ចូលដោយផ្ទាល់
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Province */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        ខេត្ត/ក្រុង
                      </label>
                      <select
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all"
                        value={formData.province}
                        onChange={(e) => {
                          updateData("province", e.target.value);
                          updateData("district", "");
                          updateData("commune", "");
                          updateData("village", "");
                          setManualFields({
                            district: false,
                            commune: false,
                            village: false,
                          });
                        }}
                      >
                        <option value="">-- ជ្រើសរើសខេត្ត --</option>
                        {provinces.map((p) => (
                          <option
                            key={p.province_code}
                            value={String(p.province_code)}
                          >
                            {p.province_kh}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          ស្រុក/ខណ្ឌ
                        </label>
                        {formData.province && (
                          <button
                            type="button"
                            onClick={() => toggleManual("district")}
                            className="text-[11px] sm:text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                          >
                            <Edit3 size={11} />{" "}
                            {manualFields.district
                              ? "ជ្រើសរើសពីបញ្ជី"
                              : "បញ្ចូលដោយដៃ"}
                          </button>
                        )}
                      </div>
                      {manualFields.district ||
                      (districtList.length === 0 && formData.province) ? (
                        <input
                          type="text"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all"
                          placeholder="វាយបញ្ចូលឈ្មោះស្រុក/ខណ្ឌ..."
                          value={formData.district}
                          onChange={(e) =>
                            updateData("district", e.target.value)
                          }
                        />
                      ) : (
                        <select
                          disabled={!formData.province}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all disabled:opacity-50 disabled:bg-slate-100"
                          value={formData.district}
                          onChange={(e) => {
                            updateData("district", e.target.value);
                            updateData("commune", "");
                            updateData("village", "");
                          }}
                        >
                          <option value="">-- ជ្រើសរើសស្រុក --</option>
                          {districtList.map((d) => (
                            <option
                              key={d.district_code}
                              value={String(d.district_code)}
                            >
                              {d.district_kh}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Commune */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          ឃុំ/សង្កាត់
                        </label>
                        {formData.district && (
                          <button
                            type="button"
                            onClick={() => toggleManual("commune")}
                            className="text-[11px] sm:text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                          >
                            <Edit3 size={11} />{" "}
                            {manualFields.commune
                              ? "ជ្រើសរើសពីបញ្ជី"
                              : "បញ្ចូលដោយដៃ"}
                          </button>
                        )}
                      </div>
                      {manualFields.commune ||
                      (communeList.length === 0 && formData.district) ? (
                        <input
                          type="text"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all"
                          placeholder="វាយបញ្ចូលឈ្មោះឃុំ/សង្កាត់..."
                          value={formData.commune}
                          onChange={(e) =>
                            updateData("commune", e.target.value)
                          }
                        />
                      ) : (
                        <select
                          disabled={!formData.district}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all disabled:opacity-50 disabled:bg-slate-100"
                          value={formData.commune}
                          onChange={(e) => {
                            updateData("commune", e.target.value);
                            updateData("village", "");
                          }}
                        >
                          <option value="">-- ជ្រើសរើសឃុំ --</option>
                          {communeList.map((c) => (
                            <option
                              key={c.commune_code}
                              value={String(c.commune_code)}
                            >
                              {c.commune_kh}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Village */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          ភូមិ
                        </label>
                        {formData.commune && (
                          <button
                            type="button"
                            onClick={() => toggleManual("village")}
                            className="text-[11px] sm:text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                          >
                            <Edit3 size={11} />{" "}
                            {manualFields.village
                              ? "ជ្រើសរើសពីបញ្ជី"
                              : "បញ្ចូលដោយដៃ"}
                          </button>
                        )}
                      </div>
                      {manualFields.village ||
                      (villageList.length === 0 && formData.commune) ? (
                        <input
                          type="text"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all"
                          placeholder="វាយបញ្ចូលឈ្មោះភូមិ..."
                          value={formData.village}
                          onChange={(e) =>
                            updateData("village", e.target.value)
                          }
                        />
                      ) : (
                        <select
                          disabled={!formData.commune}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all disabled:opacity-50 disabled:bg-slate-100"
                          value={formData.village}
                          onChange={(e) =>
                            updateData("village", e.target.value)
                          }
                        >
                          <option value="">-- ជ្រើសរើសភូមិ --</option>
                          {villageList.map((v) => (
                            <option
                              key={v.village_code}
                              value={String(v.village_code)}
                            >
                              {v.village_kh}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="p-2.5 sm:p-3 bg-sky-50 text-sky-600 rounded-xl sm:rounded-2xl border border-sky-100 shrink-0">
                      <Calendar size={22} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                        កាលបរិច្ឆេទ និងពេលវេលា
                      </h2>
                      <p className="text-xs text-slate-500 truncate">
                        កំណត់ពេលវេលាច្បាស់លាស់សម្រាប់កម្មវិធី
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Date Field */}
                    <div className="min-w-0 w-full">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        ថ្ងៃប្រារព្ធ
                      </label>
                      <div className="relative w-full">
                        <input
                          type="date"
                          className="w-full min-w-0 block px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          value={formData.date}
                          onChange={(e) => updateData("date", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Time Field */}
                    <div className="min-w-0 w-full">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        ម៉ោងចាប់ផ្ដើម
                      </label>
                      <div className="relative w-full">
                        <input
                          type="time"
                          className="w-full min-w-0 block px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 text-sm transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          value={formData.time}
                          onChange={(e) => updateData("time", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="p-2.5 sm:p-3 bg-sky-50 text-sky-600 rounded-xl sm:rounded-2xl border border-sky-100">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        ពិនិត្យ និងបញ្ចប់
                      </h2>
                      <p className="text-xs text-slate-500">
                        ផ្ទៀងផ្ទាត់ព័ត៌មានមុនពេលបង្កើតលិខិតអញ្ជើញ
                      </p>
                    </div>
                  </div>

                  {/* Dark Glass Card Preview */}
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white shadow-2xl overflow-hidden border border-sky-500/20"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 border border-sky-400/30 rounded-full text-sky-300 text-[11px] font-semibold mb-4 sm:mb-6">
                      <Building2 size={13} /> លិខិតអញ្ជើញផ្លូវការ
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
                      {formData.title || "ចំណងជើងកម្មវិធី"}
                    </h3>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {formData.description || "មិនទាន់បានបញ្ចូលការពិពណ៌នា..."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-700/60 pt-5 sm:pt-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-800/80 rounded-xl text-sky-400 border border-slate-700 shrink-0">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            កាលបរិច្ឆេទ & ម៉ោង
                          </p>
                          <p className="text-xs font-semibold text-white mt-0.5">
                            {formData.date
                              ? new Date(formData.date).toLocaleDateString(
                                  "km-KH",
                                  { dateStyle: "medium" },
                                )
                              : "មិនទាន់កំណត់"}
                          </p>
                          <p className="text-xs text-sky-400 font-medium">
                            ម៉ោង {formData.time || "--:--"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-800/80 rounded-xl text-blue-400 border border-slate-700 shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            ទីតាំងប្រារព្ធ
                          </p>
                          <p className="text-xs font-semibold text-white mt-0.5">
                            {getProvinceName() || "រាជធានីភ្នំពេញ"}
                          </p>
                          <p className="text-xs text-slate-300 line-clamp-2">
                            {[
                              getDistrictName(),
                              getCommuneName(),
                              getVillageName(),
                            ]
                              .filter(Boolean)
                              .join(", ") || "មិនទាន់កំណត់"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="mx-4 sm:mx-8 mb-1 flex items-start gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="px-4 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
              step === 1 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft size={16} /> ថយក្រោយ
          </button>

          <button
            type="button"
            onClick={step === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {step === 4 ? (
              isSubmitting ? (
                <>
                  កំពុងរក្សាទុក...{" "}
                  <Loader2 size={15} className="animate-spin" />
                </>
              ) : (
                <>
                  បង្កើតលិខិតអញ្ជើញ <Send size={15} />
                </>
              )
            ) : (
              <>
                បន្តទៅមុខ <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
