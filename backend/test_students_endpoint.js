import axios from 'axios';
import jwt from 'jsonwebtoken';

// Create a fake admin token for testing
const SECRET = 'your_secret_key'; // Should match your backend secret
const adminToken = jwt.sign(
  { id: 1, email: 'admin@learnix.com', role: 'admin' },
  SECRET,
  { expiresIn: '1h' }
);

console.log('Testing /api/admin/students endpoint...\n');

axios.get('http://localhost:5001/api/admin/students', {
  headers: {
    Authorization: `Bearer ${adminToken}`
  }
})
.then(response => {
  console.log('✅ Success! Students fetched:');
  console.log(`Total students: ${response.data.length}`);
  if (response.data.length > 0) {
    console.log('\nFirst student:', JSON.stringify(response.data[0], null, 2));
  }
})
.catch(error => {
  console.log('❌ Error:', error.response?.status, error.response?.statusText);
  console.log('Error data:', error.response?.data);
  console.log('Full error:', error.message);
})
.finally(() => process.exit(0));
