import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend, color = "blue", delay = 0 }) {
  const colors = {
    blue: "from-blue-500 to-cyan-400",
    red: "from-red-500 to-pink-500",
    gold: "from-amber-400 to-orange-500",
    navy: "from-indigo-600 to-blue-600",
    green: "from-emerald-500 to-teal-400"
  };

  return (
    <div 
      className="card p-6 animate-slide-up hover:scale-[1.02] transition-transform duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800 font-display">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg shadow-${color}-500/30`}>
          <Icon size={24} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`
            flex items-center font-bold
            ${trend >= 0 ? "text-emerald-600" : "text-red-500"}
          `}>
            {trend >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
