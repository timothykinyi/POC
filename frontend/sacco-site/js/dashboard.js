const apiURL = 'http://localhost:3000/members';

// Retrieve the logged-in member's data from localStorage
let loggedInMember = JSON.parse(localStorage.getItem('loggedInMember'));

// Ensure that money-related properties exist
if (loggedInMember) {
  loggedInMember.loans = loggedInMember.loans || [];
  loggedInMember.savings = loggedInMember.savings || 0;
  loggedInMember.dividends = loggedInMember.dividends || 0;
  loggedInMember.shares = loggedInMember.shares || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // If no member is logged in, redirect to the login page
  if (!loggedInMember) {
    window.location.href = 'login.html';
    return;
  }

  // Display the member's name on the dashboard
  document.getElementById('memberName').textContent = loggedInMember.name;

  // Update the account summary section with member's financial data
  updateAccountSummary();

  // Load and display the member's loan status
  loadLoanStatus();

  // Event listener for loan application form submission
  document.getElementById('loanApplicationForm').addEventListener('submit', applyForLoan);

  // Event listener for savings form submission (deposit or withdraw)
  document.getElementById('savingsForm').addEventListener('submit', manageSavings);
});

// Function to update the account summary section
function updateAccountSummary() {
  document.getElementById('sharesAmount').textContent = Number(loggedInMember.shares).toFixed(2);
  document.getElementById('dividendsAmount').textContent = Number(loggedInMember.dividends).toFixed(2);
  
  // Calculate total loans; if no loans, default to 0
  const totalLoans = Array.isArray(loggedInMember.loans)
    ? loggedInMember.loans.reduce((acc, loan) => acc + Number(loan.amount), 0)
    : 0;
  document.getElementById('loansAmount').textContent = totalLoans.toFixed(2);
  
  document.getElementById('savingsAmount').textContent = Number(loggedInMember.savings).toFixed(2);
}

// Function to load and display the member's loan status
function loadLoanStatus() {
  const loanStatusList = document.getElementById('loanStatusList');
  loanStatusList.innerHTML = '';

  if (Array.isArray(loggedInMember.loans)) {
    loggedInMember.loans.forEach((loan) => {
      const li = document.createElement('li');
      li.textContent = `Loan of ${Number(loan.amount).toFixed(2)} - ${loan.status}`;
      loanStatusList.appendChild(li);
    });
  }
}

// Function to handle loan application submissions
function applyForLoan(event) {
  event.preventDefault();
  const loanAmountInput = document.getElementById('loanAmount');
  const loanAmount = parseFloat(loanAmountInput.value);

  if (isNaN(loanAmount) || loanAmount <= 0) {
    alert('Please enter a valid loan amount.');
    return;
  }

  const newLoan = {
    amount: loanAmount,
    status: 'Pending',
  };

  loggedInMember.loans.push(newLoan);
  updateMemberData(loggedInMember);
  loadLoanStatus();
  loanAmountInput.value = ''; // Clear input
}

// Function to handle savings deposits and withdrawals
function manageSavings(event) {
  event.preventDefault();
  const action = event.submitter.dataset.action; // Either 'deposit' or 'withdraw'
  const savingsInput = document.getElementById('savingsAmountInput');
  const amount = parseFloat(savingsInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  if (action === 'deposit') {
    loggedInMember.savings += amount;
  } else if (action === 'withdraw') {
    if (amount > loggedInMember.savings) {
      alert('Insufficient savings balance.');
      return;
    }
    loggedInMember.savings -= amount;
  }

  updateMemberData(loggedInMember);
  updateAccountSummary();
  savingsInput.value = ''; // Clear input
}

// Function to update member data on the server and in localStorage
function updateMemberData(updatedMember) {
  fetch(`${apiURL}/${updatedMember.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedMember),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to update member data: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Update localStorage with the updated member data
      loggedInMember = data;
      localStorage.setItem('loggedInMember', JSON.stringify(data));
      updateAccountSummary();
    })
    .catch((error) => {
      console.error('Error updating member data:', error);
    });
}
