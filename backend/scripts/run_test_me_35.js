import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const userId = 35; // anitha@gmail.com (completed)
const courseId = 1;

const token = jwt.sign({ id: userId, email: 'anitha@gmail.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

const options = {
  hostname: 'localhost',
  port: 5001,
  path: `/api/certificates/generate/me/${courseId}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

console.log('➡️ Requesting certificate (me) for userId', userId, 'courseId', courseId);

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);

  if (res.statusCode !== 200) {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.error('❌ Error response:', body);
      process.exit(res.statusCode);
    });
    return;
  }

  const filePath = path.resolve(process.cwd(), 'backend', `certificate_me_test_${userId}_${courseId}.pdf`);
  const fileStream = fs.createWriteStream(filePath);
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    console.log('✅ Certificate (me) saved to', filePath);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});

req.end();
