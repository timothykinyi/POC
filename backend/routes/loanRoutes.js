const express = require('express');
const {
  applyLoan,
  approveLoan,
  rejectLoan,
  getLoanDetails,
  repayLoan,
} = require('../controllers/loanController');

const router = express.Router();

// Route to apply for a loan
router.post('/apply', applyLoan);

// Route to approve a loan
router.post('/approve/:loanId', approveLoan);

// Route to reject a loan
router.post('/reject/:loanId', rejectLoan);

// Route to get loan details
router.get('/:loanId', getLoanDetails);

// Route to repay a loan
router.post('/repay/:loanId', repayLoan);

module.exports = router;
