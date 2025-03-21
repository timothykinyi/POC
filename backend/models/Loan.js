const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  memberId:  {type: String, required: true},
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 10 }, // 10% interest
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Repaid"], default: "Pending" },
  repaymentDate: { type: Date, required: true },
});

module.exports = mongoose.model("Loan", loanSchema);
