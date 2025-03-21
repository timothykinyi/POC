import { useState } from "react";

const Savings = () => {
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState("");

  const handleTransaction = (type) => {
    if (!amount || isNaN(amount)) return;
    const newBalance = type === "deposit" ? balance + Number(amount) : balance - Number(amount);
    if (newBalance >= 0) setBalance(newBalance);
    setAmount("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Savings</h1>
      <p className="mb-4">Balance: Ksh {balance}</p>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="p-2 border rounded" />
      <button onClick={() => handleTransaction("deposit")} className="ml-2 bg-green-500 text-white p-2 rounded">Deposit</button>
      <button onClick={() => handleTransaction("withdraw")} className="ml-2 bg-red-500 text-white p-2 rounded">Withdraw</button>
    </div>
  );
};

export default Savings;
