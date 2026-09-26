import PermissionForm from "./components/permission-request/PermissionForm";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 sm:h-96 bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none z-0 blur-3xl" />

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <div className="relative shrink-0 group">
              <img
                src="/logo.jpg"
                alt="នាយកដ្ឋានមុខងារ និងធនធាន Logo"
                className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl object-cover ring-2 ring-slate-200/80 dark:ring-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105"
              />

              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse" />
            </div>

            <div className="min-w-0">
              <h2 className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-xl leading-tight truncate tracking-tight">
                នាយកដ្ឋានមុខងារ និងធនធាន
              </h2>

              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                ប្រព័ន្ធគ្រប់គ្រងលិខិតស្នើសុំអនុញ្ញាតច្បាប់
              </p>
            </div>
          </div>

          {/* Telegram Button */}
          <a
            href="https://t.me/vichea_chann"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ទំនាក់ទំនងជំនួយ"
            className="inline-flex h-8 w-8 sm:h-auto sm:w-auto shrink-0 items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-0 sm:px-5 py-0 sm:py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-400/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-800 hover:shadow-md hover:shadow-blue-500/30 active:translate-y-0 active:scale-[0.97]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21.5 3.5 2.9 10.7c-1.27.5-1.26 1.2-.23 1.5l4.77 1.49 1.83 5.67c.22.61.11.86.75.86.49 0 .71-.22.98-.48l2.32-2.25 4.83 3.57c.89.49 1.53.23 1.75-.83l3.16-14.89c.32-1.31-.5-1.9-1.56-1.34ZM8.17 13.3l10.83-6.83c.51-.31.98-.14.59.19l-8.77 7.91-.34 3.39-2.31-4.66Z" />
            </svg>

            <span className="hidden sm:inline">ទំនាក់ទំនងជំនួយ</span>
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative z-10 flex flex-col">
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-16 pt-3 sm:pt-6 flex-1">
          <PermissionForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-[10px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            © {new Date().getFullYear()} នាយកដ្ឋានមុខងារ និងធនធាន.
            រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>

          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <a
              href="https://t.me/vichea_chann"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ជំនួយបច្ចេកទេស
            </a>

            <a
              href="https://t.me/vichea_chann"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ទំនាក់ទំនង
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
