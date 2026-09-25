import { motion } from "framer-motion";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import type { PermissionRequestData } from "../../types/permission-request";
import { PrintablePermissionForm } from "./PrintablePermissionForm";

interface SuccessViewProps {
  permissionText: string;
  formData: PermissionRequestData;
  madeAt: string;
  onDownloadPdf: () => void;
  onReset: () => void;
}

export function SuccessView({
  permissionText,
  formData,
  madeAt,
  onDownloadPdf,
  onReset,
}: SuccessViewProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/60 p-6 sm:p-10 text-center print-hide relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          បានបញ្ជូនជោគជ័យ!
        </h2>
        <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          លិខិតស្នើសុំអនុញ្ញាតច្បាប់ត្រូវបានរក្សាទុក
          និងផ្ញើជូនប្រព័ន្ធដោយជោគជ័យ។
        </p>

        <div className="bg-gradient-to-b from-slate-50/80 to-slate-100/60 border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-left mb-8 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <p className="text-lg text-blue-500 underline font-weight-500">
              សេចក្តីសង្ខេបសំណើ
            </p>
            <p className="text-md text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 inline-flex items-center gap-1">
              <CheckCircle />
              បានផ្ទៀងផ្ទាត់
            </p>
          </div>
          <div
            className="whitespace-pre-wrap break-words text-base sm:text-lg leading-8 text-slate-800 font-normal"
            style={{
              fontFamily: "'Siemreap', 'Noto Sans Khmer', sans-serif",
            }}
          >
            {permissionText}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="flex-1 h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-xl shadow-slate-900/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 group"
          >
            <Download
              size={18}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
            ទាញយកជា PDF
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 h-13 px-6 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-base rounded-xl transition-all duration-200 hover:border-slate-300 active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <RotateCcw
              size={18}
              className="transition-transform duration-300 hover:-rotate-45"
            />
            បង្កើតថ្មីម្ដងទៀត
          </button>
        </div>
      </motion.div>

      <PrintablePermissionForm formData={formData} madeAt={madeAt} />
    </div>
  );
}
