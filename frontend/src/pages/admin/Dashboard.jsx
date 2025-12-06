import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import StatsCard from "../../components/StatsCard";
import { Users, Calendar, Wallet, TrendingUp, ArrowRight } from "lucide-react";

// For charts
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const { request } = useAxios();

  const [data, setData] = useState({
    users: [],
    events: [],
    budgets: [],
    currentBudget: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, events, budgets, currentBudget] = await Promise.all([
          request({ url: "/api/admin/users", method: "GET" }),
          request({ url: "/api/events", method: "GET" }),
          request({ url: "/api/budgets", method: "GET" }),
          request({ url: "/api/budgets/current", method: "GET" }),
        ]);

        setData({ users, events, budgets, currentBudget });
      } catch (err) {
        console.error("❌ Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-hkn-red/20 border-t-hkn-red rounded-full animate-spin" />
      </div>
    );

  const { users, events, budgets, currentBudget } = data;

  // Total remaining across all budgets
  const totalRemaining = budgets.reduce(
    (sum, b) => sum + b.remainingAmount,
    0
  );

  // Spending trend based on events (fake monthly buckets)
  const monthlyTrend = [
    { month: "Jan", amount: 20000 },
    { month: "Feb", amount: 35000 },
    { month: "Mar", amount: 15000 },
    { month: "Apr", amount: 40000 },
    { month: "May", amount: 25000 },
  ];

  // Pie chart for events grouped by budget
  const eventByBudget = budgets.map((b) => ({
    name: b.name,
    value: events.filter((e) => e.budget.id === b.id).length,
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ef4444"];

  return (
    <div className="space-y-8">
      
      {/* ======= TOP METRIC CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
            title="Total Users" 
            value={users.length} 
            icon={Users} 
            color="blue" 
            trend={12} 
            delay={0}
        />
        <StatsCard 
            title="Total Events" 
            value={events.length} 
            icon={Calendar} 
            color="navy" 
            trend={-5} 
            delay={100}
        />
        <StatsCard 
            title="Budgets Created" 
            value={budgets.length} 
            icon={Wallet} 
            color="green" 
            delay={200}
        />
        <StatsCard 
            title="Total Remaining" 
            value={`₹${totalRemaining.toLocaleString()}`} 
            icon={TrendingUp} 
            color="gold" 
            trend={8} 
            delay={300}
        />
      </div>

      {/* ======= CHARTS ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LINE CHART - Spending Trend */}
        <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 font-display">Spending Analytics</h2>
                <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 outline-none text-slate-600">
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                </select>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrend}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PIE CHART - Event Distribution */}
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 font-display mb-6">Event Distribution</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={eventByBudget}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                    >
                        {eventByBudget.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {eventByBudget.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-slate-600 truncate max-w-[120px]">{entry.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

       {/* BAR CHART - Budget Status */}
       <div className="card">
            <h2 className="text-xl font-bold text-slate-800 font-display mb-6">Budget Allocation vs Remaining</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={budgets.map((b) => ({
                        name: b.name,
                        allocated: b.initialAmount,
                        remaining: b.remainingAmount,
                    }))}
                    barGap={8}
                    >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="allocated" fill="#6366f1" radius={[4, 4, 0, 0]} name="Initial Allocation" />
                    <Bar dataKey="remaining" fill="#22c55e" radius={[4, 4, 0, 0]} name="Remaining Balance" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      {/* ======= RECENT EVENTS TABLE ======= */}
      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-display">Recent Activity</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                <th className="px-6 py-4 text-left">Event Name</th>
                <th className="px-6 py-4 text-left">Budget Source</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Created By</th>
                <th className="px-6 py-4 text-center">Status</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
                {events.slice(-5).map((ev) => (
                <tr key={ev.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{ev.name}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {ev.budget?.name}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">₹{ev.allocatedAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {ev.createdBy?.toString().charAt(0) || 'U'}
                            </div>
                            <span>User #{ev.createdBy}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            Approved
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
