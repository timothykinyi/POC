const apiURL = 'http://localhost:3000/members';
const companyURL = 'http://localhost:3000/company'; // Assumes a company record with id:1 exists

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadMembersBtn').addEventListener('click', loadMembers);
  document.getElementById('companyForm').addEventListener('submit', updateCompanyRecords);
  
  // Load members automatically on page load
  loadMembers();

  // Use event delegation for the loan buttons
  document.getElementById('loansList').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const action = e.target.getAttribute('data-action');
      const memberId = e.target.getAttribute('data-member-id');
      const loanIndex = e.target.getAttribute('data-loan-index');
      if (memberId && loanIndex && action) {
        updateLoanStatus(memberId, parseInt(loanIndex), action);
      }
    }
  });
});

// Load all members, display members, loans, and overall totals
function loadMembers() {
  fetch(apiURL)
    .then(response => response.json())
    .then(members => {
      displayMembers(members);
      displayLoans(members);
      computeAndDisplayTotals(members);
    })
    .catch(error => console.error('Error loading members:', error));
}

// Display members in the members section
function displayMembers(members) {
  const membersList = document.getElementById('membersList');
  membersList.innerHTML = '';
  members.forEach(member => {
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('member');
    memberDiv.innerHTML = `
      <h3>${member.name} (ID: ${member.memberId})</h3>
      <p>Email: ${member.email}</p>
      <p>Phone: ${member.phone}</p>
      <p>Membership Type: ${member.membershipType}</p>
      <p>Shares: ${Number(member.shares).toFixed(2)} | Savings: ${Number(member.totalSavings).toFixed(2)} | Dividends: ${Number(member.dividends).toFixed(2)}</p>
    `;
    membersList.appendChild(memberDiv);
  });
}

// Display pending loans across all members using event delegation attributes
function displayLoans(members) {
  const loansListDiv = document.getElementById('loansList');
  loansListDiv.innerHTML = '';
  
  members.forEach(member => {
    if (Array.isArray(member.loans)) {
      member.loans.forEach((loan, index) => {
        if (loan.status === 'Pending') {
          const loanDiv = document.createElement('div');
          loanDiv.classList.add('loan-item');
          loanDiv.innerHTML = `
            <strong>${member.name}</strong> requested a loan of ${Number(loan.amount).toFixed(2)}
            <button data-action="Approved" data-member-id="${member.id}" data-loan-index="${index}">Approve</button>
            <button class="reject" data-action="Rejected" data-member-id="${member.id}" data-loan-index="${index}">Reject</button>
          `;
          loansListDiv.appendChild(loanDiv);
        }
      });
    }
  });
}

// Update loan status for a given member and loan index
function updateLoanStatus(memberId, loanIndex, newStatus) {
  console.log(`Updating loan for member ${memberId} at index ${loanIndex} to ${newStatus}`);
  fetch(`${apiURL}/${memberId}`)
    .then(response => response.json())
    .then(member => {
      if (Array.isArray(member.loans) && member.loans[loanIndex] !== undefined) {
        if (newStatus === 'Approved') {
          // Set status to Approved and calculate total with 8% interest
          member.loans[loanIndex].status = 'Approved';
          const originalLoanAmount = Number(member.loans[loanIndex].amount);
          const totalWithInterest = originalLoanAmount * 1.08;
          // Add total with interest to member's savings
          member.totalSavings = Number(member.totalSavings || 0) + totalWithInterest;
          // Update loan amount to reflect new total with interest
          member.loans[loanIndex].amount = totalWithInterest;
        } else if (newStatus === 'Rejected') {
          // Set status to Rejected and loan amount to 0
          member.loans[loanIndex].status = 'Rejected';
          member.loans[loanIndex].amount = 0;
        }
        return fetch(`${apiURL}/${memberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        });
      } else {
        throw new Error('Loan not found for this member.');
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update loan status.');
      }
      return response.json();
    })
    .then(updatedMember => {
      alert(`Loan ${newStatus}`);
      loadMembers(); // Refresh data after update
    })
    .catch(error => console.error('Error updating loan status:', error));
}

// Compute overall totals and display them
function computeAndDisplayTotals(members) {
  const totalShares = members.reduce((acc, member) => acc + Number(member.shares || 0), 0);
  const totalSavings = members.reduce((acc, member) => acc + Number(member.totalSavings || 0), 0);

  // Fetch company record to get totalMoneyAvailable
  fetch(`${companyURL}/1`)
    .then(response => response.json())
    .then(company => {
      if (!company) {
        console.error('No company record found.');
        return;
      }
      const totalMoneyAvailable = Number(company.totalMoneyAvailable || 0);
      const totalAmountsAvailable = totalMoneyAvailable - (totalSavings + totalShares);
      displayTotals(totalShares, totalSavings, totalAmountsAvailable);
    })
    .catch(error => console.error('Error fetching company record:', error));
}

// Display the overall totals in the totals section
function displayTotals(totalShares, totalSavings, totalAmountsAvailable) {
  const totalsDiv = document.getElementById('overallTotals');
  totalsDiv.innerHTML = `
    <p><strong>Total Shares:</strong> ${totalShares.toFixed(2)}</p>
    <p><strong>Total Savings:</strong> ${totalSavings.toFixed(2)}</p>
    <p><strong>Total Amounts Available:</strong> ${totalAmountsAvailable.toFixed(2)}</p>
  `;
}

// Update company records and automatically allocate dividends based on member shares
function updateCompanyRecords(event) {
  event.preventDefault();
  const totalMoneyAvailable = parseFloat(document.getElementById('totalMoneyAvailable').value);
  const totalProfit = parseFloat(document.getElementById('totalProfit').value);
  const dividendPercentage = parseFloat(document.getElementById('dividendPercentage').value);
  const savingInterestRate = parseFloat(document.getElementById('savingInterestRate').value);

  if (isNaN(totalMoneyAvailable) || totalMoneyAvailable <= 0 ||
      isNaN(totalProfit) || totalProfit <= 0 ||
      isNaN(dividendPercentage) || dividendPercentage < 0) {
    alert('Please enter valid company values.');
    return;
  }

  // Calculate dividend pool based on profit and dividend percentage
  const dividendPool = totalProfit * (dividendPercentage / 100);

  // Fetch all members to update dividends proportionally based on shares
  fetch(apiURL)
    .then(response => response.json())
    .then(members => {
      const totalShares = members.reduce((acc, member) => acc + Number(member.shares || 0), 0);
      if (totalShares === 0) {
        alert('No shares found across members.');
        return;
      }
      
      const updatePromises = members.map(member => {
        const memberDividend = (Number(member.shares) / totalShares) * dividendPool;
        member.dividends = Number(member.dividends || 0) + memberDividend;
        return fetch(`${apiURL}/${member.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        }).then(res => res.json());
      });
      
      return Promise.all(updatePromises);
    })
    .then(() => {
      // Update the company record with new values
      const companyData = {
        id: 1,
        totalMoneyAvailable,
        totalProfit,
        dividendPercentage,
        savingInterestRate
      };
      
      return fetch(`${companyURL}/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update company record.');
      }
      return response.json();
    })
    .then(() => {
      alert('Company records updated and dividends allocated automatically!');
      loadMembers();
    })
    .catch(error => console.error('Error updating company records:', error));
}

document.getElementById('registerAdminForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newAdmin = {
      name: document.getElementById('adminName').value,
      email: document.getElementById('adminEmail').value,
      password: document.getElementById('adminPassword').value // Ensure this is securely handled
    };
    fetch('http://localhost:3000/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to register new admin.');
      }
      return response.json();
    })
    .then(() => {
      alert('New admin registered successfully!');
      document.getElementById('registerAdminForm').reset();
    })
    .catch(error => console.error('Error registering new admin:', error));
  });
  
  