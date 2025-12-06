import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
export default function UserManagement() {
  const { request } = useAxios();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "MEMBER",
  });
  const [bulkUsers, setBulkUsers] = useState([]);
  const [fileError, setFileError] = useState("");

  // Fetch users
  const loadUsers = async () => {
    const res = await request({
      url: "/api/admin/users",
      method: "GET",
    });
    setUsers(res);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const payload = {
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      role: form.role,
    };

    await request({
      url: "/api/admin/create-user",
      method: "POST",
      data: payload,
    });

    // Reset form
    setForm({
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "MEMBER",
    });

    loadUsers();
  };

  const handleChangeRole = async (userId, newRole) => {
    await request({
      url: `/api/admin/role/${userId}`,
      method: "PUT",
      params: { role: newRole },
    });
    loadUsers();
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          prepareBulkUsers(result.data);
        },
      });
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        prepareBulkUsers(json);
      };
      reader.readAsBinaryString(file);
    } else {
      setFileError("Unsupported file format. Upload CSV or Excel only.");
    }
  };

  const prepareBulkUsers = (rows) => {
    const cleaned = rows.map((row) => ({
      fullName: row.fullName?.trim() || "",
      email: row.email?.trim() || "",
      phone: row.phone?.trim() || "",
      username: row.username?.trim() || "",
      password: row.password?.trim() || "",
      role: row.role?.trim().toUpperCase() || "MEMBER",
    }));

    setBulkUsers(cleaned);
    setFileError("");
  };
  const handleBulkUpload = async () => {
    if (bulkUsers.length === 0) {
      setFileError("Please upload a valid file first.");
      return;
    }

    await request({
      url: "/api/admin/create-users",
      method: "POST",
      data: { users: bulkUsers },
    });

    setBulkUsers([]);
    loadUsers();
    alert("Users created successfully!");
  };

  const toggleStatus = async (userId) => {
    await request({
      url: `/api/admin/disable/${userId}`,
      method: "PUT",
    });
    loadUsers();
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      {/* Create User Card */}
      {/* Create User Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create User
        </h2>

        <form
          onSubmit={handleCreateUser}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            required
            type="text"
            className="border w-full px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            required
            type="text"
            className="border w-full px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            required
            type="email"
            className="border w-full px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            required
            type="text"
            className="border w-full px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            required
            type="password"
            className="border w-full px-4 py-2 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            required
            className="border w-full px-4 py-2 rounded-lg bg-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="TREASURER">TREASURER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition col-span-full"
          >
            Create User
          </button>
        </form>
      </div>
      {/* Bulk Upload Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Bulk User Upload
        </h2>

        <div className="space-y-4">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="border p-3 rounded-lg w-full cursor-pointer bg-gray-50"
          />

          {fileError && <p className="text-red-600 text-sm">{fileError}</p>}

          {bulkUsers.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">
                Parsed Users: {bulkUsers.length}
              </p>
              <button
                onClick={handleBulkUpload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Upload Users
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="th">Name</th>
              <th className="th">Username</th>
              <th className="th">Email</th>
              <th className="th">Phone</th>
              <th className="th">Role</th>
              <th className="th">Status</th>
              <th className="th text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="td">{user.fullName}</td>
                <td className="td">{user.username}</td>
                <td className="td">{user.email}</td>
                <td className="td">{user.phone}</td>

                <td className="td">
                  <select
                    className="border rounded px-2 py-1"
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="TREASURER">TREASURER</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                </td>

                <td className="td">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="td text-center">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
