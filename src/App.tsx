import InvitationForm from "./components/InvitationForm";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 khmer-siemreap selection:bg-sky-600 selection:text-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-1 ring-slate-200 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-slate-950 text-base sm:text-lg leading-snug truncate">
                នាយកដ្ឋានមុខងារ និងធនធាន
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                ប្រព័ន្ធគ្រប់គ្រងលិខិតស្នើសុំអនុញ្ញាតច្បាប់
              </p>
            </div>
          </div>

          <a
            href="https://www.telegram.me/vichea_chann"
            className="min-h-10 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 text-sm sm:text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
          >
            ទំនាក់ទំនង
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-3">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="max-w-3xl">
              <p className="text-base font-bold text-sky-700 mb-2">
                Permission Request
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
                លិខិតស្នើសុំអនុញ្ញាតច្បាប់
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 leading-8">
                បំពេញព័ត៌មាន ផ្ទៀងផ្ទាត់ទម្រង់សំណើ បញ្ជូនទៅប្រព័ន្ធ និងទាញយកជាឯកសារ PDF ផ្លូវការ។
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                បំពេញ
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                បញ្ជូន
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                PDF
              </div>
            </div>
          </div>
        </section>

        <InvitationForm />
      </main>

      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="font-semibold text-slate-500 text-sm sm:text-base">
            © {new Date().getFullYear()} នាយកដ្ឋានមុខងារ និងធនធាន. រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
          <div className="flex items-center gap-5 text-sm sm:text-base font-semibold text-slate-500">
            <a href="https://www.telegram.me/vichea_chann" className="hover:text-sky-700 transition-colors">
              ជំនួយ
            </a>
            <a href="https://www.telegram.me/vichea_chann" className="hover:text-sky-700 transition-colors">
              ទំនាក់ទំនង
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
