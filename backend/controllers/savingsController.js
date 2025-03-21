const Savings = require("../models/Savings");

// Deposit Savings
const deposit = async (req, res) => {
  try {
    const { memberId, amount } = req.body;
    let savings = await Savings.findOne({ memberId });

    if (!savings) {
      savings = new Savings({ memberId, balance: 0 });
    }

    savings.balance += amount;
    await savings.save();

    res.status(200).json({ message: "Deposit successful", savings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw Savings
const withdraw = async (req, res) => {
  try {
    const { memberId, amount } = req.body;
    const savings = await Savings.findOne({ memberId });

    if (!savings || savings.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    savings.balance -= amount;
    await savings.save();

    res.status(200).json({ message: "Withdrawal successful", savings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { deposit, withdraw };
