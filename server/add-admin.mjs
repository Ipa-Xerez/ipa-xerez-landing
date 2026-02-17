import mysql from 'mysql2/promise';

const email = process.argv[2];
const name = process.argv[3] || 'Administrator';

if (!email) {
  console.error('Usage: node add-admin.mjs <email> [name]');
  process.exit(1);
}

async function addAdmin() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM administrators WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      console.log(`✓ ${email} is already an administrator`);
      return;
    }
    
    // Get user ID from email
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      console.error(`✗ User with email ${email} not found. User must login first.`);
      process.exit(1);
    }
    
    const userId = users[0].id;
    
    // Add administrator
    await connection.execute(
      'INSERT INTO administrators (userId, email, name, permissions) VALUES (?, ?, ?, ?)',
      [userId, email, name, 'blog,newsletter,events']
    );
    
    console.log(`✓ ${email} has been added as an administrator`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

addAdmin();
