import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export default function MemberDashboard() {
  const { request } = useAxios();

  const [stats, setStats] = useState({
    totalEvents: 0,
    upcoming: 0,
    past: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const events = await request({ url: "/api/events", method: "GET" });
        const now = Date.now();
        const upcoming = events.filter(e => e.date > now).length; // Assuming date is timestamp
        const past = events.filter(e => e.date <= now).length;

        setStats({
          totalEvents: events.length,
          upcoming,
          past,
        });
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hkn-navy">Member Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of chapter activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcoming}
          icon={Clock}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Past Events"
          value={stats.past}
          icon={CheckCircle}
          color="bg-purple-50 text-purple-600"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-hkn-navy">{value}</h3>
      </div>
    </Card>
  );
}
