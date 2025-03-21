const apiURL = 'http://localhost:3000/members';

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const memberId = document.getElementById('memberId').value.trim();
  const password = document.getElementById('password').value;
  const loginMessage = document.getElementById('loginMessage');

  // Fetch members
  fetch(`${apiURL}?memberId=${memberId}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Member ID not found!';
      } else {
        const member = data[0];
        if (member.password === password) {
          loginMessage.style.color = 'green';
          loginMessage.textContent = 'Login successful!';
          // Store member info (you can redirect to dashboard here)
          localStorage.setItem('loggedInMember', JSON.stringify(member));
          setTimeout(() => {
            window.location.href = "dashboard.html"; // create later
          }, 1000);
        } else {
          loginMessage.style.color = 'red';
          loginMessage.textContent = 'Incorrect password!';
        }
      }
    })
    .catch(error => {
      console.error(error);
      loginMessage.style.color = 'red';
      loginMessage.textContent = 'Login failed!';
    });
});
