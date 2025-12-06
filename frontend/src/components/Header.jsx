import { Bell, Search, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes("events")) return "Event Management";
    if (path.includes("budgets")) return "Budget Overview";
    if (path.includes("users")) return "User Management";
    if (path.includes("reports")) return "Financial Reports";
    return "Dashboard";
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-40 animate-slide-down ml-72">
      {/* Glass Background Panel */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm" />

      {/* Content Container */}
      <div className="relative z-10 flex w-full justify-between items-center max-w-7xl mx-auto">
        
        {/* Title & Breadcrumbs */}
        <div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">
                {getPageTitle(location.pathname)}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
                Welcome back, {username}
            </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Search Bar (Visual Only) */}
          <div className="hidden md:flex items-center bg-white/50 border border-slate-200 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-600 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 hover:shadow-md hover:border-blue-100 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 hover:shadow-md transition-all">
                <Settings size={20} />
             </button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-white/80 border border-white/60 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{username}</p>
                <p className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 tracking-wider">{role}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 border-2 border-white">
                {username?.charAt(0).toUpperCase()}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
