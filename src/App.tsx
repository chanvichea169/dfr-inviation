import InvitationForm from "./components/InvitationForm";
import { useLocations } from "./hooks/useLocations";
import { motion } from "framer-motion";

// Helper component to render colorful animated stars
const ColorfulStars = () => {
  const colors = [
    "text-amber-400",
    "text-pink-500",
    "text-cyan-400",
    "text-indigo-400",
    "text-purple-400",
    "text-emerald-400",
    "text-rose-400",
  ];

  // Generate 25 stars with varied positions, sizes, and delays
  const stars = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 95)}%`,
    size: Math.floor(Math.random() * 12) + 8, // size between 8px and 20px
    color: colors[i % colors.length],
    duration: Math.random() * 3 + 2, // animation duration 2s - 5s
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.svg
          key={star.id}
          className={`absolute ${star.color}`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </motion.svg>
      ))}
    </div>
  );
};

export default function App() {
  const { provinces, districts, communes, villages, loading } = useLocations();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 khmer-siemreap selection:bg-blue-500 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Background Decorative Gradients & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/2 translate-x-1/2 -z-10 w-full max-w-7xl h-[600px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-teal-400/10 blur-3xl rounded-full pointer-events-none" />

      {/* Colorful Animated Stars Background */}
      <ColorfulStars />

      <div className="relative z-10">
        {/* Sticky Header / Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/80 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-blue-600/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  នាយកដ្ឋានមុខងារ និងធនធាន
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  ប្រព័ន្ធគ្រប់គ្រងលិខិតអញ្ជើញ
                </span>
              </div>
            </motion.div>

            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="#help"
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition-colors"
              >
                ជំនួយ
              </a>
              <a
                href="https://www.telegram.me/vichea_chann"
                className="text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all"
              >
                ទំនាក់ទំនង
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              ប្រព័ន្ធបង្កើតលិខិតអញ្ជើញឌីជីថល
            </motion.div>

            {/* Main Avatar / Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative mb-6 group"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <img
                src="/logo.jpg"
                alt="Logo"
                className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover ring-4 ring-white shadow-2xl"
              />
            </motion.div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight max-w-3xl">
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
                នាយកដ្ឋានមុខងារ និងធនធាន
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
              បង្កើតលិខិតអញ្ជើញប្រកបដោយវិជ្ជាជីវៈ និងភាពងាយស្រួល
              ត្រឹមតែប៉ុន្មាននាទីប៉ុណ្ណោះ។
            </p>
          </motion.div>
        </section>

        {/* Main Form Section */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            /* Skeleton Loading State */
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/60 max-w-4xl mx-auto space-y-8 animate-pulse">
              <div className="h-8 bg-slate-200 rounded-md w-1/3 mx-auto mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="h-14 bg-slate-100 rounded-xl" />
                <div className="h-14 bg-slate-100 rounded-xl" />
                <div className="h-14 bg-slate-100 rounded-xl" />
                <div className="h-14 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-32 bg-slate-100 rounded-xl w-full" />
              <div className="h-12 bg-blue-200/60 rounded-xl w-full sm:w-1/2 mx-auto" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10"
            >
              <InvitationForm
                provinces={provinces}
                districts={districts}
                communes={communes}
                villages={villages}
              />
            </motion.div>
          )}
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <p className="font-semibold text-slate-600 text-xs sm:text-sm">
              © {new Date().getFullYear()} នាយកដ្ឋានមុខងារ និងធនធាន.
              រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
            <a
              href="https://www.telegram.me/vichea_chann"
              className="hover:text-blue-600 transition-colors"
            >
              ជំនួយ
            </a>
            <a
              href="#privacy"
              className="hover:text-blue-600 transition-colors"
            >
              គោលការណ៍
            </a>
            <a
              href="https://www.telegram.me/vichea_chann"
              className="hover:text-blue-600 transition-colors"
            >
              ទំនាក់ទំនង
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
