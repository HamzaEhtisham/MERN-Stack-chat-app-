import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('JWT_SECRET:', process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Create a test token
const testToken = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, {
  expiresIn: '15d',
});

console.log('Test token created:', testToken);

// Verify the token
try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('Token verification successful:', decoded);
} catch (error) {
  console.error('Token verification failed:', error.message);
}