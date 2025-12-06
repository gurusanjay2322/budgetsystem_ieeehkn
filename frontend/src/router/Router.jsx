import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Budgets from "../pages/admin/Budgets";
import Events from "../pages/admin/Events";
import Transactions from "../pages/Transactions";
import TreasurerDashboard from "../pages/TreasurerDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import RequireRole from "./RequireRole";
import Unauthorized from "../pages/Unauthorized";
import Home from "../pages/Home";
import MemberDashboard from "../pages/MemberDashboard";
import MemberEvents from "../pages/MemberEvents";
import Deadlines from "../pages/Deadlines";
import Reports from "../pages/Reports";


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirect root based on role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* ADMIN SECTION */}
        <Route
          element={
            <ProtectedRoute>
              <RequireRole allowed={["ADMIN"]}>
                <DashboardLayout />
              </RequireRole>
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/budgets" element={<Budgets />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/deadlines" element={<Deadlines />} />
        </Route>

        {/* TREASURER SECTION */}
        <Route
          element={
            <ProtectedRoute>
              <RequireRole allowed={["TREASURER"]}>
                <DashboardLayout />
              </RequireRole>
            </ProtectedRoute>
          }
        >
          <Route path="/treasurer" element={<TreasurerDashboard />} />
          <Route path="/treasurer/transactions" element={<Transactions />} />
          <Route path="/treasurer/reports" element={<Reports />} />
          <Route path="/treasurer/deadlines" element={<Deadlines />} />
          {/* Reuse Admin components for Treasurer where applicable */}
          <Route path="/treasurer/events" element={<Events />} />
          <Route path="/treasurer/budgets" element={<Budgets />} />
        </Route>

        {/* MEMBER SECTION (optional) */}
        <Route
          element={
            <ProtectedRoute>
              <RequireRole allowed={["MEMBER"]}>
                <DashboardLayout />
              </RequireRole>
            </ProtectedRoute>
          }
        >
          <Route
            path="/member"
            element={
              <RequireRole allowed={["MEMBER"]}>
                <MemberDashboard />
              </RequireRole>
            }
          />

          <Route
            path="/member/events"
            element={
              <RequireRole allowed={["MEMBER"]}>
                <MemberEvents />
              </RequireRole>
            }
          />
        </Route>

        {/* SHARED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <RequireRole allowed={["ADMIN", "TREASURER", "MEMBER"]}>
                <DashboardLayout />
              </RequireRole>
            </ProtectedRoute>
          }
        >
           <Route path="/deadlines" element={<Deadlines />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
