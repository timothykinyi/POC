const mongoose = require("mongoose");

const savingsSchema = new mongoose.Schema({
  memberId:  {type: String, required: true},
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Savings", savingsSchema);
