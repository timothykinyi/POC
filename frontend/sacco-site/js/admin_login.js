const apiURL = 'http://localhost:3000/admins';

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const loginMessage = document.getElementById('loginMessage');

  // Query the admins endpoint with provided credentials
  fetch(`${apiURL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        // Login successful
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Login successful!';
        localStorage.setItem('loggedInAdmin', JSON.stringify(data[0]));
        setTimeout(() => {
          window.location.href = 'admin.html'; // Redirect to your admin panel page
        }, 1000);
      } else {
        // Login failed
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Invalid credentials!';
      }
    })
    .catch(error => {
      loginMessage.style.color = 'red';
      loginMessage.textContent = 'Error during login.';
      console.error('Login error:', error);
    });
});
