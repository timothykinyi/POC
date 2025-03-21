import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/savings" className="p-4 bg-green-500 text-white rounded">Savings</Link>
        <Link to="/loans" className="p-4 bg-blue-500 text-white rounded">Loans</Link>
      </div>
    </div>
  );
};

export default Dashboard;
