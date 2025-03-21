// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, required: true, enum: ['contribution', 'deposit', 'withdrawal'] },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
