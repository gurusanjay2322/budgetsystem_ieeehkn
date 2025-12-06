import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Wallet, 
  FileText, 
  Users, 
  Settings 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", to: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Dashboard", to: "/treasurer", icon: LayoutDashboard, roles: ["TREASURER"] },
    { name: "Dashboard", to: "/member", icon: LayoutDashboard, roles: ["MEMBER"] },
    { name: "Events", to: "/admin/events", icon: Calendar, roles: ["ADMIN", "TREASURER", "MEMBER"] },
    { name: "Budgets", to: "/admin/budgets", icon: Wallet, roles: ["ADMIN", "TREASURER", "MEMBER"] },
    { name: "Reports", to: "/admin/reports", icon: FileText, roles: ["ADMIN", "TREASURER"] },
    { name: "Users", to: "/admin/users", icon: Users, roles: ["ADMIN"] },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50 animate-slide-in-left border-r border-slate-700/50">
      
      {/* Brand Section */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hkn-red to-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
            <span className="font-bold text-white text-lg">H</span>
        </div>
        <div>
            <h1 className="text-xl font-bold font-display tracking-wide">HKN Budget</h1>
            <p className="text-xs text-slate-400 font-medium">Financial Manager</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
        {menu.filter((m) => m.roles.includes(role)).map((item, index) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                animate-fade-in
                ${isActive 
                  ? "bg-white text-slate-900 shadow-xl shadow-white/10 scale-[1.02]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"}
              `}>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-hkn-red rounded-r-full" />
              )}

              <Icon size={20} className={`transition-transform duration-300 ${isActive ? "scale-110 text-hkn-red" : "group-hover:scale-110"}`} />
              <span className={`font-medium ${isActive ? "font-bold" : ""}`}>{item.name}</span>
              
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-xl blur-md -z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
          <span className="font-medium group-hover:text-red-400">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
