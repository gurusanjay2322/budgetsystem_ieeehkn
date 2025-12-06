import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function Events() {
  const { request, loading } = useAxios();

  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [form, setForm] = useState({
    name: "",
    allocatedAmount: "",
  });

  const [editingEvent, setEditingEvent] = useState(null);

  // Load all budgets + events initially
  useEffect(() => {
    loadBudgets();
    loadEvents();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await request({
        url: "/api/budgets",
        method: "GET",
      });
      setBudgets(res);
    } catch (err) {
      console.error("Failed to load budgets", err);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await request({
        url: "/api/events",
        method: "GET",
      });
      setEvents(res);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const filterByBudget = async (budgetId) => {
    setSelectedBudget(budgetId);

    if (!budgetId) return loadEvents();

    try {
      const res = await request({
        url: `/api/events/budget/${budgetId}`,
        method: "GET",
      });
      setEvents(res);
    } catch (err) {
      console.error("Filter failed", err);
    }
  };

  const submitEvent = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      allocatedAmount: Number(form.allocatedAmount),
    };

    try {
      if (editingEvent) {
        // EDIT EVENT
        await request({
          url: `/api/events/${editingEvent.id}`,
          method: "PUT",
          data: payload,
        });
      } else {
        // CREATE EVENT
        await request({
          url: "/api/events",
          method: "POST",
          data: payload,
        });
      }

      resetForm();
      loadEvents();
    } catch (err) {
      console.error("Event save failed", err);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;

    try {
      await request({
        url: `/api/events/${id}`,
        method: "DELETE",
      });
      loadEvents();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setForm({
      name: event.name,
      allocatedAmount: event.allocatedAmount,
    });
  };

  const resetForm = () => {
    setEditingEvent(null);
    setForm({
      name: "",
      allocatedAmount: "",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Events</h1>

        <select
          value={selectedBudget}
          onChange={(e) => filterByBudget(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Budgets</option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.academicYear}
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <form
        onSubmit={submitEvent}
        className="bg-white p-5 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Event Name"
          className="border rounded-lg px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Allocated Amount"
          className="border rounded-lg px-3 py-2"
          value={form.allocatedAmount}
          onChange={(e) =>
            setForm({ ...form, allocatedAmount: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          {editingEvent ? "Update Event" : "Add Event"}
        </button>

        {editingEvent && (
          <button
            type="button"
            className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* EVENTS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{ev.name}</h2>

            <p className="text-gray-700">
              <strong>Amount:</strong> ₹{ev.allocatedAmount}
            </p>

            <p className="text-gray-700">
              <strong>Budget:</strong> {ev.budget?.name} (
              {ev.budget?.academicYear})
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => startEdit(ev)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteEvent(ev.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading…</p>}
    </div>
  );
}
