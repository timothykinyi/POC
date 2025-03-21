import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Savings from "./pages/dashboard/Savings";
import Loans from "./pages/dashboard/Loans";
import Shares from "./pages/dashboard/Shares";
import Transactions from "./pages/dashboard/Transactions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Members from "./pages/admin/Members";
import AdminLoans from "./pages/admin/Loans";
import Dividends from "./pages/admin/Dividends";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/shares" element={<Shares />} />
        <Route path="/transactions" element={<Transactions />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/loans" element={<AdminLoans />} />
        <Route path="/admin/dividends" element={<Dividends />} />
      </Routes>
    </Router>
  );
}

export default App;