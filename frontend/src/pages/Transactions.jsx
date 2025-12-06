import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Plus, Edit2, Trash2, Filter, Search } from "lucide-react";

export default function Transactions() {
  const { request } = useAxios();

  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBudget, setFilterBudget] = useState("all");

  const [form, setForm] = useState({
    eventId: "",
    budgetId: "",
    amount: "",
    type: "",
    status: "",
    category: "",
    notes: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch events, budgets, transactions
  useEffect(() => {
    const load = async () => {
      try {
        const [tx, bd, ev] = await Promise.all([
          request({ url: "/api/transactions", method: "GET" }),
          request({ url: "/api/budgets", method: "GET" }),
          request({ url: "/api/events", method: "GET" }),
        ]);

        setTransactions(tx || []);
        setBudgets(bd || []);
        setEvents(ev || []);
      } catch (e) {
        console.error("Load error", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEventChange = (eventId) => {
    const selected = events.find((e) => e.id == eventId);
    setForm({
      ...form,
      eventId,
      budgetId: selected?.budget?.id || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      eventId: Number(form.eventId),
      budgetId: Number(form.budgetId),
      amount: Number(form.amount),
      type: form.type,
      status: form.status,
      category: form.category,
      notes: form.notes
    };

    try {
      if (editingId) {
        await request({
          url: `/api/transactions/${editingId}`,
          method: "PUT",
          data: payload,
        });
      } else {
        await request({
          url: "/api/transactions",
          method: "POST",
          data: payload,
        });
      }

      const updated = await request({
        url: "/api/transactions",
        method: "GET",
      });

      setTransactions(updated || []);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;

    try {
      await request({ url: `/api/transactions/${id}`, method: "DELETE" });
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      eventId: t.eventId,
      budgetId: t.budgetId,
      amount: t.amount,
      type: t.type,
      status: t.status,
      category: t.category,
      notes: t.notes
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      eventId: "",
      budgetId: "",
      amount: "",
      type: "",
      status: "",
      category: "",
      notes: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilter = async (budgetId) => {
    setFilterBudget(budgetId);
    try {
      if (budgetId === "all") {
        const tx = await request({ url: "/api/transactions", method: "GET" });
        setTransactions(tx || []);
      } else {
        const tx = await request({
          url: `/api/transactions/budget/${budgetId}`,
          method: "GET",
        });
        setTransactions(tx || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEventName = (eventId) => {
    return events.find((e) => e.id === eventId)?.name || "Unknown";
  };

  const getBudgetName = (budgetId) => {
    return budgets.find((b) => b.id === budgetId)?.name || "Unknown";
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-hkn-navy">Transactions</h1>
          <p className="text-sm text-gray-500">Manage income and expenses</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterBudget}
              onChange={(e) => handleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hkn-pale-blue focus:border-hkn-steel-blue outline-none appearance-none bg-white"
            >
              <option value="all">All Budgets</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? "Cancel" : <><Plus size={18} className="mr-2" /> Add New</>}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-hkn-gold animate-fade-in">
          <h2 className="text-xl font-bold text-hkn-navy mb-6">
            {editingId ? "Edit Transaction" : "Add New Transaction"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-hkn-navy">Event *</label>
              <select
                value={form.eventId}
                onChange={(e) => handleEventChange(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Event</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} — ({ev.budget.name})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-hkn-navy">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-hkn-navy">Status *</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PLANNED">Planned</option>
                <option value="RECURRING">Recurring</option>
              </select>
            </div>

            <Input
              label="Category"
              type="text"
              placeholder="e.g. Food, Venue, Grant"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-hkn-navy">Budget</label>
              <input
                type="text"
                className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                value={form.budgetId ? getBudgetName(form.budgetId) : "Auto-filled from Event"}
                disabled
              />
            </div>

            <div className="col-span-full">
              <label className="text-sm font-medium text-hkn-navy mb-1 block">Notes</label>
              <textarea
                placeholder="Additional details..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field min-h-[80px]"
              ></textarea>
            </div>

            <div className="col-span-full flex justify-end gap-3">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="primary">
                {editingId ? "Update Transaction" : "Save Transaction"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-hkn-navy text-white uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{getEventName(t.eventId)}</td>
                    <td className={`px-6 py-4 font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.category}</td>
                    <td className="px-6 py-4 text-gray-600">{getBudgetName(t.budgetId)}</td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
