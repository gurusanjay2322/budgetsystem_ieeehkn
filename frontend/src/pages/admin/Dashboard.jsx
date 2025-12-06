import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

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
      <div className="p-6 text-xl font-semibold animate-pulse">
        Loading Dashboard...
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
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* ======= TOP METRIC CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={users.length} color="bg-blue-500" />
        <MetricCard title="Total Events" value={events.length} color="bg-purple-500" />
        <MetricCard title="Budgets Created" value={budgets.length} color="bg-green-500" />
        <MetricCard
          title="Remaining Budget"
          value={`₹${totalRemaining.toLocaleString()}`}
          color="bg-orange-500"
        />
      </div>

      {/* ======= CHARTS ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LINE CHART - Spending Trend */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Spending Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - Allocated vs Remaining */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Budget Allocation Status</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={budgets.map((b) => ({
                name: b.name,
                allocated: b.initialAmount,
                remaining: b.remainingAmount,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="allocated" fill="#6366f1" />
              <Bar dataKey="remaining" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART - Event Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Events by Budget</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={eventByBudget}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {eventByBudget.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======= RECENT EVENTS TABLE ======= */}
      <div className="bg-white rounded-xl p-6 shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Events</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Event</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Created By</th>
            </tr>
          </thead>

          <tbody>
            {events.slice(-5).map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="p-2 border">{ev.name}</td>
                <td className="p-2 border">{ev.budget?.name}</td>
                <td className="p-2 border">₹{ev.allocatedAmount.toLocaleString()}</td>
                <td className="p-2 border">{ev.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <div className={`${color} text-white p-5 rounded-xl shadow-lg`}>
      <h2 className="text-lg">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
