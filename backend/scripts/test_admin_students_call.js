import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const secret = process.env.JWT_SECRET;
const token = jwt.sign({ id: 1, email: 'admin@learnix.com', role: 'admin' }, secret, { expiresIn: '1h' });

axios.get('http://localhost:5001/api/admin/students', {
  headers: { Authorization: `Bearer ${token}` }
})
.then(r => { console.log('Status', r.status); console.log('Count', r.data.length); })
.catch(err => { console.error('Error status:', err.response?.status); console.error('Data:', err.response?.data); console.error('Message:', err.message); })
.finally(() => process.exit(0));
