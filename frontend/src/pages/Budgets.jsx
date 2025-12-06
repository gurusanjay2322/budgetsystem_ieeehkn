import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Plus, Edit2, Trash2, Wallet } from "lucide-react";

export default function Budgets() {
  const { request } = useAxios();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    totalAmount: "",
    academicYear: "2024-2025" // Default
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bd, tx] = await Promise.all([
        request({ url: "/api/budgets", method: "GET" }),
        request({ url: "/api/transactions", method: "GET" })
      ]);
      setBudgets(bd || []);
      setTransactions(tx || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSpent = (budgetId) => {
    return transactions
      .filter(t => t.budgetId === budgetId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        totalAmount: Number(form.totalAmount),
        academicYear: form.academicYear
      };

      if (editingId) {
        await request({ url: `/api/budgets/${editingId}`, method: "PUT", data: payload });
      } else {
        await request({ url: "/api/budgets", method: "POST", data: payload });
      }

      loadData();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this budget?")) return;
    try {
      await request({ url: `/api/budgets/${id}`, method: "DELETE" });
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      totalAmount: b.totalAmount,
      academicYear: b.academicYear
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: "", totalAmount: "", academicYear: "2024-2025" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading budgets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hkn-navy">Budgets</h1>
          <p className="text-sm text-gray-500">Plan and track financial allocations</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : <><Plus size={18} className="mr-2" /> Create Budget</>}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-t-4 border-t-hkn-gold animate-fade-in">
          <h2 className="text-xl font-bold text-hkn-navy mb-6">
            {editingId ? "Edit Budget" : "Create New Budget"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Budget Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Total Amount"
              type="number"
              value={form.totalAmount}
              onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
              required
            />
            <Input
              label="Academic Year"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              required
            />
            <div className="col-span-full flex justify-end gap-3">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="primary">
                {editingId ? "Update Budget" : "Save Budget"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spent = calculateSpent(budget.id);
          const percentage = Math.min((spent / budget.totalAmount) * 100, 100);
          const isOverBudget = spent > budget.totalAmount;

          return (
            <Card key={budget.id} className="p-6 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-hkn-navy rounded-lg">
                  <Wallet size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(budget)} className="text-gray-400 hover:text-hkn-navy transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(budget.id)} className="text-gray-400 hover:text-hkn-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-hkn-navy mb-1">{budget.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{budget.academicYear}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Spent: ₹{spent.toLocaleString()}</span>
                  <span className="text-hkn-navy">Total: ₹{budget.totalAmount.toLocaleString()}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-hkn-red' : 'bg-hkn-steel-blue'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="text-right text-xs font-medium">
                  <span className={isOverBudget ? 'text-hkn-red' : 'text-hkn-steel-blue'}>
                    {percentage.toFixed(1)}% Used
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
