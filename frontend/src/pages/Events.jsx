import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Plus, Edit2, Trash2, Calendar, MapPin } from "lucide-react";

export default function Events() {
  const { request } = useAxios();
  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    budgetId: "",
    description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ev, bd] = await Promise.all([
        request({ url: "/api/events", method: "GET" }),
        request({ url: "/api/budgets", method: "GET" })
      ]);
      setEvents(ev || []);
      setBudgets(bd || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        date: new Date(form.date).getTime(), // Convert to timestamp
        location: form.location,
        budgetId: Number(form.budgetId),
        description: form.description
      };

      if (editingId) {
        await request({ url: `/api/events/${editingId}`, method: "PUT", data: payload });
      } else {
        await request({ url: "/api/events", method: "POST", data: payload });
      }

      loadData();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await request({ url: `/api/events/${id}`, method: "DELETE" });
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (ev) => {
    setForm({
      name: ev.name,
      date: new Date(ev.date).toISOString().split('T')[0], // Convert timestamp to YYYY-MM-DD
      location: ev.location || "",
      budgetId: ev.budget?.id || "",
      description: ev.description || ""
    });
    setEditingId(ev.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: "", date: "", location: "", budgetId: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hkn-navy">Events</h1>
          <p className="text-sm text-gray-500">Manage chapter activities and events</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : <><Plus size={18} className="mr-2" /> Create Event</>}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-t-4 border-t-hkn-gold animate-fade-in">
          <h2 className="text-xl font-bold text-hkn-navy mb-6">
            {editingId ? "Edit Event" : "Create New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Event Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-hkn-navy">Budget Allocation *</label>
              <select
                value={form.budgetId}
                onChange={(e) => setForm({ ...form, budgetId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Budget</option>
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-sm font-medium text-hkn-navy mb-1 block">Description</label>
              <textarea
                placeholder="Event details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[80px]"
              ></textarea>
            </div>

            <div className="col-span-full flex justify-end gap-3">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="primary">
                {editingId ? "Update Event" : "Save Event"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <Card key={ev.id} className="p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="bg-hkn-navy p-4 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold truncate pr-2">{ev.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(ev)} className="text-blue-200 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="text-blue-200 hover:text-red-300 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-hkn-gold" />
                <span className="text-sm font-medium">
                  {new Date(ev.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {ev.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-hkn-gold" />
                  <span className="text-sm">{ev.location}</span>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Budget</p>
                <p className="text-sm font-semibold text-hkn-navy">{ev.budget?.name || "Unallocated"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
