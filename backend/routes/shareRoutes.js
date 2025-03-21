const express = require('express');
const {
  buyShares,
  sellShares,
  getShares,
  distributeDividends,
} = require('../controllers/shareController');

const router = express.Router();

// Route to buy shares
router.post('/buy', buyShares);

// Route to sell shares
router.post('/sell', sellShares);

// Route to get a member's shares
router.get('/:memberId', getShares);

// Route to distribute dividends
router.post('/distribute-dividends', distributeDividends);

module.exports = router;
