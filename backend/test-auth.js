import fetch from 'node-fetch';

// Add this line to your package.json if needed: "type": "module"

// Function to test login and protected route
async function testAuth() {
  try {
    // 1. Login to get JWT token
    console.log('Attempting login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser', // Replace with a valid username in your database
        password: 'password123' // Replace with the correct password
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginResponse.status !== 200) {
      console.error('Login failed:', loginData.error);
      return;
    }

    // Extract cookies from response headers
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies:', cookies);

    if (!cookies) {
      console.error('No cookies received from login');
      return;
    }

    // 2. Access a protected route
    console.log('\nTesting protected route...');
    const protectedResponse = await fetch('http://localhost:5000/api/users/', {
      headers: {
        'Cookie': cookies
      }
    });

    const protectedData = await protectedResponse.json();
    console.log('Protected route response:', protectedData);

    if (protectedResponse.status === 200) {
      console.log('\nAuthentication working correctly! JWT token is valid.');
    } else {
      console.error('\nAuthentication failed:', protectedData.error);
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testAuth();