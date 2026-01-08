import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const secret = process.env.JWT_SECRET || 'test';
const token = jwt.sign({ id: 1, email: 'admin@learnix.com', role: 'admin' }, secret, { expiresIn: '1h' });
console.log(token);
