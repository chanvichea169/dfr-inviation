import PermissionForm from "./components/permission-request/PermissionForm";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Background Decorative Gradients & Grid Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none z-0 blur-3xl" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Department Brand */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0 group">
              <img
                src="/logo.jpg"
                alt="នាយកដ្ឋានមុខងារ និងធនធាន Logo"
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl object-cover ring-2 ring-slate-200/80 dark:ring-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-slate-950 dark:text-white text-base sm:text-xl leading-snug truncate tracking-tight">
                នាយកដ្ឋានមុខងារ និងធនធាន
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                ប្រព័ន្ធគ្រប់គ្រងលិខិតស្នើសុំអនុញ្ញាតច្បាប់
              </p>
            </div>
          </div>

          {/* Header Action Button */}
          <a
            href="https://t.me/vichea_chann"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-blue-600 bg-transparent px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-800 active:scale-[0.98] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/40 dark:hover:border-blue-400 dark:hover:text-blue-300"
          >
            <svg
              className="w-4 h-4 opacity-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>

            <span className="font-extrabold text-slate-950 dark:text-white text-base sm:text-md leading-snug truncate tracking-tight">
              ទំនាក់ទំនងជំនួយ
            </span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col">
        {/* <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                ប្រព័ន្ធដំណើរការធម្មតា
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-950 dark:text-white leading-tight tracking-tight">
                លិខិតស្នើសុំអនុញ្ញាតច្បាប់
              </h1>
            </div>
          </div>
        </section> */}

        {/* Permission Request Form Component Container */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1">
          <PermissionForm />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} នាយកដ្ឋានមុខងារ និងធនធាន.
            រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
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
