const express = require('express');
const { deposit, withdraw, getSavings } = require('../controllers/savingsController');

const router = express.Router();

// Route to deposit savings
router.post('/deposit', deposit);

// Route to withdraw savings
router.post('/withdraw', withdraw);

// Route to get a member's savings balance
router.get('/:memberId', getSavings);

module.exports = router;
