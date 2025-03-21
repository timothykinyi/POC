import { useState } from "react";

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanStatus, setLoanStatus] = useState("Not Requested");

  const requestLoan = () => {
    if (!loanAmount || isNaN(loanAmount)) return;
    setLoanStatus(`Pending Approval - Ksh ${loanAmount}`);
    setLoanAmount("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Loans</h1>
      <p className="mb-4">Loan Status: {loanStatus}</p>
      <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Enter loan amount" className="p-2 border rounded" />
      <button onClick={requestLoan} className="ml-2 bg-blue-500 text-white p-2 rounded">Request Loan</button>
    </div>
  );
};

export default Loans;
