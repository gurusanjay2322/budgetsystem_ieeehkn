import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import { Calendar, MapPin } from "lucide-react";

export default function MemberEvents() {
  const { request } = useAxios();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await request({ url: "/api/events", method: "GET" });
        setEvents(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading events...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hkn-navy">Events</h1>
        <p className="text-sm text-gray-500">Upcoming chapter events and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(e => (
          <Card key={e.id} className="p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="bg-hkn-navy p-4 text-white">
              <h3 className="text-lg font-bold truncate">{e.name}</h3>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-hkn-gold" />
                <span className="text-sm font-medium">
                  {new Date(e.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {e.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-hkn-gold" />
                  <span className="text-sm">{e.location}</span>
                </div>
              )}

              {e.description && (
                <p className="text-sm text-gray-500 line-clamp-3 mt-2">{e.description}</p>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Budget Source</p>
                <p className="text-sm font-semibold text-hkn-navy">{e.budget?.name || "Unallocated"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
