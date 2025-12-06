import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Header = () => {
    const location = useLocation();
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username") || role || "User";

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin/users')) return 'User Management';
        if (path.includes('/admin/budgets')) return 'Budget Management';
        if (path.includes('/admin/events')) return 'Event Management';
        if (path.includes('/admin/reports')) return 'Reports';
        if (path.includes('/admin/deadlines')) return 'Deadlines';
        if (path.includes('/treasurer/transactions')) return 'Transactions';
        if (path.includes('/treasurer/reports')) return 'Reports';
        if (path.includes('/treasurer/deadlines')) return 'Deadlines';
        if (path.includes('/member/events')) return 'My Events';
        if (path === '/admin' || path === '/treasurer' || path === '/member') return 'Dashboard';
        return 'Smart Budget';
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-6 sticky top-0 z-10 slide-down shadow-sm">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-slate-900 fade-in">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2.5 text-slate-500 hover:text-hkn-red hover:bg-red-50 rounded-xl transition-all duration-300 relative group transform hover:scale-110">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hkn-red rounded-full pulse-subtle"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 capitalize">{username}</p>
                        <p className="text-xs text-slate-500 capitalize font-medium">{role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hkn-navy to-blue-900 text-white flex items-center justify-center font-bold border-2 border-hkn-gold/50 shadow-lg shadow-hkn-navy/20 transform hover:scale-110 transition-all duration-300 cursor-pointer">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
