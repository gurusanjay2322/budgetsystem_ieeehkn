import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";

export default function Deadlines() {
    const [deadlines, setDeadlines] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        date: "",
        amount: "",
        description: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem("hkn_deadlines");
        if (saved) {
            setDeadlines(JSON.parse(saved));
        }
    }, []);

    const saveDeadlines = (newDeadlines) => {
        setDeadlines(newDeadlines);
        localStorage.setItem("hkn_deadlines", JSON.stringify(newDeadlines));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDeadline = {
            id: Date.now(),
            ...form,
            amount: Number(form.amount)
        };
        saveDeadlines([...deadlines, newDeadline]);
        setForm({ title: "", date: "", amount: "", description: "" });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this deadline?")) return;
        saveDeadlines(deadlines.filter(d => d.id !== id));
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        const deadline = new Date(dateString);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-hkn-navy">Deadline Tracking</h1>
                    <p className="text-sm text-gray-500">Track grant applications and funding deadlines</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : <><Plus size={18} className="mr-2" /> Add Deadline</>}
                </Button>
            </div>

            {showForm && (
                <Card className="p-6 border-t-4 border-t-hkn-gold animate-fade-in">
                    <h2 className="text-xl font-bold text-hkn-navy mb-6">Add New Deadline</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. University Grant Application"
                            required
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            required
                        />
                        <Input
                            label="Target Amount (Optional)"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            placeholder="0.00"
                        />
                        <div className="col-span-full">
                            <label className="text-sm font-medium text-hkn-navy mb-1 block">Description</label>
                            <textarea
                                placeholder="Details..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="input-field min-h-[80px]"
                            ></textarea>
                        </div>
                        <div className="col-span-full flex justify-end">
                            <Button type="submit" variant="primary">Save Deadline</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deadlines.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        No deadlines set. Click "Add Deadline" to start tracking.
                    </div>
                ) : (
                    deadlines.sort((a, b) => new Date(a.date) - new Date(b.date)).map((d) => {
                        const daysLeft = getDaysRemaining(d.date);
                        const isUrgent = daysLeft <= 7 && daysLeft >= 0;
                        const isOverdue = daysLeft < 0;

                        return (
                            <Card key={d.id} className={`p-6 hover:shadow-md transition-shadow relative overflow-hidden ${isUrgent ? 'border-l-4 border-l-hkn-red' : 'border-l-4 border-l-hkn-navy'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-50 text-hkn-red' : 'bg-blue-50 text-hkn-navy'}`}>
                                        <Clock size={24} />
                                    </div>
                                    <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-hkn-red transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-hkn-navy mb-1">{d.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{d.description}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="font-medium">
                                            {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {d.amount > 0 && (
                                        <div className="text-sm font-semibold text-hkn-navy">
                                            Target: ₹{d.amount.toLocaleString()}
                                        </div>
                                    )}

                                    <div className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md inline-block ${isOverdue ? 'bg-red-100 text-red-700' :
                                            isUrgent ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {isOverdue ? `${Math.abs(daysLeft)} Days Overdue` : `${daysLeft} Days Left`}
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
