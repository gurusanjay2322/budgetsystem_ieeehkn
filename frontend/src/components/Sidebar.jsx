import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Calendar,
  LogOut,
  FileText,
  Clock,
  PieChart
} from "lucide-react";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { to: "/admin", label: "Dashboard", roles: ["ADMIN"], icon: LayoutDashboard },
    { to: "/admin/users", label: "User Management", roles: ["ADMIN"], icon: Users },
    { to: "/admin/budgets", label: "Budgets", roles: ["ADMIN"], icon: Wallet },
    { to: "/admin/events", label: "Events", roles: ["ADMIN"], icon: Calendar },
    { to: "/admin/reports", label: "Reports", roles: ["ADMIN"], icon: PieChart },
    { to: "/admin/deadlines", label: "Deadlines", roles: ["ADMIN"], icon: Clock },

    { to: "/treasurer", label: "Dashboard", roles: ["TREASURER"], icon: LayoutDashboard },
    { to: "/treasurer/transactions", label: "Transactions", roles: ["TREASURER"], icon: FileText },
    { to: "/treasurer/reports", label: "Reports", roles: ["TREASURER"], icon: PieChart },
    { to: "/treasurer/deadlines", label: "Deadlines", roles: ["TREASURER"], icon: Clock },

    { to: "/member", label: "Dashboard", roles: ["MEMBER"], icon: LayoutDashboard },
    { to: "/member/events", label: "Events", roles: ["MEMBER"], icon: Calendar },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-20 slide-in-left border-r border-slate-700/50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50 flex items-center gap-3 slide-down">
        <div className="w-10 h-10 bg-gradient-to-br from-hkn-gold to-yellow-500 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shadow-hkn-gold/20 transform hover:scale-110 transition-transform duration-300">
          B
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide text-white leading-none">Smart Budget</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">IEEE-HKN</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        {menu
          .filter((m) => m.roles.includes(role))
          .map((item, index) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`stagger-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
                ${isActive
                    ? "bg-gradient-to-r from-hkn-red to-red-600 text-white shadow-lg shadow-hkn-red/30 scale-105"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105"
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-hkn-red/0 via-hkn-red/10 to-hkn-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <Icon 
                  size={20} 
                  className={`relative z-10 transition-all duration-300 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-hkn-gold group-hover:rotate-12"
                  }`} 
                />
                <span className="relative z-10">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-hkn-gold rounded-full pulse-subtle" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* Footer + Logout */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105 active:scale-95 group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          Logout
        </button>
      </div>
    </aside>
  );
}
