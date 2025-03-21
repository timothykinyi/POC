const Share = require("../models/Share");

// Buy Shares
const buyShares = async (req, res) => {
  try {
    const { memberId, quantity } = req.body;
    const share = await Share.findOne({ memberId });

    if (!share) {
      return res.status(404).json({ message: "Member not found" });
    }

    share.totalShares += quantity;
    await share.save();

    res.status(200).json({ message: "Shares purchased successfully", share });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sell Shares
const sellShares = async (req, res) => {
  try {
    const { memberId, quantity } = req.body;
    const share = await Share.findOne({ memberId });

    if (!share || share.totalShares < quantity) {
      return res.status(400).json({ message: "Not enough shares" });
    }

    share.totalShares -= quantity;
    await share.save();

    res.status(200).json({ message: "Shares sold successfully", share });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Member Shares
const getShares = async (req, res) => {
  try {
    const { memberId } = req.params;
    const share = await Share.findOne({ memberId });

    if (!share) {
      return res.status(404).json({ message: "Shares not found" });
    }

    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const distributeDividends = async (req, res) => {
    try {
      const { totalProfit } = req.body;
      const allShares = await Share.find();
  
      const totalShares = allShares.reduce((sum, s) => sum + s.totalShares, 0);
      if (totalShares === 0) return res.status(400).json({ message: "No shares found" });
  
      allShares.forEach(async (s) => {
        s.dividendsEarned += (s.totalShares / totalShares) * totalProfit;
        await s.save();
      });
  
      res.status(200).json({ message: "Dividends distributed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
module.exports = { buyShares, sellShares, getShares };
