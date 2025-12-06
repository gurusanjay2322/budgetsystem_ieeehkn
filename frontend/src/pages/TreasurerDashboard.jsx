import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function TreasurerDashboard() {
  const { request } = useAxios();

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalExpense: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const tx = await request({ url: "/api/transactions", method: "GET" });
        setTransactions(tx || []);

        const expense = (tx || [])
          .filter((t) => t.type === "EXPENSE")
          .reduce((s, x) => s + x.amount, 0);

        const income = (tx || [])
          .filter((t) => t.type === "INCOME")
          .reduce((s, x) => s + x.amount, 0);

        setStats({
          totalTransactions: (tx || []).length,
          totalExpense: expense,
          totalIncome: income,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };

    loadStats();
  }, []);

  // Pie chart data for expense vs income
  const pieData = [
    { name: "Expenses", value: stats.totalExpense },
    { name: "Income", value: stats.totalIncome },
  ];

  const COLORS = ["#D72631", "#1A1D6C"]; // hkn-red, hkn-navy

  // Group by event for bar chart
  const eventBreakdown = Object.values(
    transactions.reduce((acc, tx) => {
      const eventName = tx.eventName || "General";
      if (!acc[eventName]) acc[eventName] = { eventName, expense: 0, income: 0 };

      if (tx.type === "EXPENSE") acc[eventName].expense += tx.amount;
      else acc[eventName].income += tx.amount;

      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hkn-navy">Treasurer Dashboard</h1>
        <div className="text-sm text-gray-500">
          Overview of financial activities
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={Activity}
          color="bg-hkn-steel-blue"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats.totalExpense.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-hkn-red"
        />
        <StatCard
          title="Total Income"
          value={`₹${stats.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-hkn-navy" // Using Navy for Income as it's a primary brand color and positive
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Income vs Expense */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-hkn-navy mb-6">Income vs Expense</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense/Income per Event */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-hkn-navy mb-6">Event-wise Breakdown</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={eventBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="eventName" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="expense" fill="#D72631" name="Expense" radius={[4, 4, 0, 0]} />
                <Bar dataKey="income" fill="#1A1D6C" name="Income" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="p-6 flex items-center justify-between hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-hkn-gold">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-hkn-navy mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} text-white shadow-sm`}>
        <Icon size={24} />
      </div>
    </Card>
  );
}
