export default function Card({ children, className = '' }) {
  return (
    <div
      className={`relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/20 dark:border-gray-700 
      rounded-2xl shadow-2xl p-6 transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] 
      ${className}`}
    >
      {children}
    </div>
  );
}
