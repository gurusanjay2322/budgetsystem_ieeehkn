import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function Budgets() {
  const { request } = useAxios();

  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    initialAmount: "",
  });

  // Load budgets
  const loadBudgets = async () => {
    const res = await request({
      url: "/api/budgets",
      method: "GET",
    });
    setBudgets(res);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // Create Budget
  const handleCreate = async (e) => {
    e.preventDefault();
    await request({
      url: "/api/budgets",
      method: "POST",
      data: form,
    });

    setForm({ name: "", initialAmount: "" });
    loadBudgets();
  };

  // Edit Budget Modal Open
  const openEditModal = (budget) => {
    setEditBudget(budget);
    setForm({
      name: budget.name,
      initialAmount: budget.initialAmount,
    });
    setShowModal(true);
  };

  // Update Budget
  const handleUpdate = async (e) => {
    e.preventDefault();
    await request({
      url: `/api/budgets/${editBudget.id}`,
      method: "PUT",
      data: form,
    });
    setShowModal(false);
    loadBudgets();
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    await request({
      url: `/api/budgets/${id}`,
      method: "DELETE",
    });
    loadBudgets();
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>

      {/* Create Budget Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create Budget
        </h2>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            className="input"
            placeholder="Budget Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Initial Amount"
            type="number"
            value={form.initialAmount}
            onChange={(e) =>
              setForm({ ...form, initialAmount: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition h-[42px] mt-auto"
          >
            Create
          </button>
        </form>
      </div>

      {/* Budgets Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Name</th>
              <th className="th">Academic Year</th>
              <th className="th">Initial Amount</th>
              <th className="th">Remaining</th>
              <th className="th text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {budgets.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="td">{b.name}</td>
                <td className="td">{b.academicYear}</td>
                <td className="td">
                  ₹{(b.initialAmount ?? 0).toLocaleString()}
                </td>

                <td className="td">
                  ₹
                  {(b.remainingAmount ?? b.initialAmount ?? 0).toLocaleString()}
                </td>

                <td className="td text-center space-x-3">
                  <button
                    onClick={() => openEditModal(b)}
                    className="px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[450px]">
            <h2 className="text-xl font-semibold mb-4">Edit Budget</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                className="input"
                placeholder="Budget Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="input"
                placeholder="Initial Amount"
                type="number"
                value={form.initialAmount}
                onChange={(e) =>
                  setForm({ ...form, initialAmount: e.target.value })
                }
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
