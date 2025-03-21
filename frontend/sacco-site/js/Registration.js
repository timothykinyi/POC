const apiURL = 'http://localhost:3000/members';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const messageDiv = document.getElementById('message');

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Retrieve form values and trim to remove unwanted spaces
    const name = document.getElementById('name').value.trim();
    const memberId = document.getElementById('memberId').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const nationalId = document.getElementById('nationalId').value.trim();
    const dob = document.getElementById('dob').value;
    const occupation = document.getElementById('occupation').value.trim();
    const address = document.getElementById('address').value.trim();
    const kinName = document.getElementById('kinName').value.trim();
    const kinPhone = document.getElementById('kinPhone').value.trim();
    const membershipType = document.getElementById('membershipType').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear any previous message
    messageDiv.textContent = '';

    // Password Check
    if (password !== confirmPassword) {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Passwords do not match!';
      return;
    }

    // Build new member object
    const newMember = {
      name,
      memberId,
      email,
      phone,
      nationalId,
      dob,
      occupation,
      address,
      kinName,
      kinPhone,
      membershipType,
      password,
      shares: 0,
      totalSavings: 0,
      dividends: 0
    };

    // Post data to JSON server
    fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Registration Successful!';
        registerForm.reset();
      })
      .catch(error => {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `Error during registration: ${error.message}`;
        console.error('Registration error:', error);
      });
  });
});
