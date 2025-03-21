const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  memberId:  {type: String, required: true},
  totalShares: { type: Number, default: 0 },
  sharePrice: { type: Number, default: 100 }, // Price per share
  dividendsEarned: { type: Number, default: 0 },
});

module.exports = mongoose.model("Share", shareSchema);
