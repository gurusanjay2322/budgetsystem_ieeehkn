import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { Plus, Search, Filter, Edit2, Trash2, Calendar, DollarSign, Wallet } from "lucide-react";

export default function Events() {
  const { request, loading } = useAxios();

  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      const res = await request({ url: "/api/budgets", method: "GET" });
      setBudgets(res);
    } catch (err) {
      console.error("Failed to load budgets", err);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await request({ url: "/api/events", method: "GET" });
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

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setForm({ name: event.name, allocatedAmount: event.allocatedAmount });
    } else {
      setEditingEvent(null);
      setForm({ name: "", allocatedAmount: "" });
    }
    setIsModalOpen(true);
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      allocatedAmount: Number(form.allocatedAmount),
    };

    try {
      if (editingEvent) {
        await request({
          url: `/api/events/${editingEvent.id}`,
          method: "PUT",
          data: payload,
        });
      } else {
        await request({
          url: "/api/events",
          method: "POST",
          data: payload,
        });
      }
      setIsModalOpen(false);
      resetForm();
      loadEvents(); // Reload to see changes
    } catch (err) {
      console.error("Event save failed", err);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await request({ url: `/api/events/${id}`, method: "DELETE" });
      loadEvents();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setForm({ name: "", allocatedAmount: "" });
  };

  const filteredEvents = events.filter(ev => 
    ev.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-hkn-steel-blue transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hkn-pale-blue/50 w-full md:w-64 transition-all shadow-sm"
            />
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
                <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <select
                    value={selectedBudget}
                    onChange={(e) => filterByBudget(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hkn-pale-blue/50 text-slate-600 appearance-none cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                >
                    <option value="">All Budgets</option>
                    {budgets.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>

            <Button onClick={() => handleOpenModal()} icon={Plus} className="shadow-lg shadow-blue-500/30">
                New Event
            </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev, index) => (
            <div 
                key={ev.id} 
                className="card group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Calendar size={24} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                                onClick={() => handleOpenModal(ev)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => deleteEvent(ev.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">{ev.name}</h3>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm text-slate-500 font-medium">Allocated</span>
                            <span className="text-lg font-bold text-slate-900">₹{ev.allocatedAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Wallet size={14} />
                            <span>{ev.budget?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        ))}
        
        {filteredEvents.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="mx-auto mb-3 opacity-50" size={48} />
                <p>No events found</p>
            </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        footer={
            <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={submitEvent} isLoading={loading}>
                    {editingEvent ? "Save Changes" : "Create Event"}
                </Button>
            </div>
        }
      >
        <form onSubmit={submitEvent} className="space-y-6">
            <Input
                label="Event Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Annual Tech Symposium"
                autoFocus
            />
            
            <Input
                label="Allocated Amount (₹)"
                type="number"
                value={form.allocatedAmount}
                onChange={(e) => setForm({ ...form, allocatedAmount: e.target.value })}
                icon={DollarSign}
                placeholder="0.00"
            />
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700 flex gap-2">
                    <span className="text-xl">💡</span>
                    Allocating funds will automatically deduct from the selected budget's remaining balance.
                </p>
            </div>
        </form>
      </Modal>

    </div>
  );
}
