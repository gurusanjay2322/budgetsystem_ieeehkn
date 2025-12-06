import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 ml-72 relative z-0">
          {/* Main Content Container with max-width and fade-in */}
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
