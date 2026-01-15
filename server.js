import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection pool
let pool;
try {
  pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'webook_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log('✅ Database pool initialized');
} catch (err) {
  console.warn('⚠️ Database connection failed:', err.message);
  console.warn('App will run without database - API calls will fail gracefully');
  pool = null;
}

// Helper function to check database availability
function checkDatabase(res) {
  if (!pool) {
    res.status(503).json({ 
      error: 'Database not available. Please set up MySQL on Railway or provide database credentials.' 
    });
    return false;
  }
  return true;
}

// ============ BOOKS ============
async function handleBooks(req, res) {
  const { method } = req;
  const { id } = req.params;

  if (!checkDatabase(res)) return;

  try {
    const conn = await pool.getConnection();

    switch (method) {
      case 'GET':
        if (id) {
          const [rows] = await conn.query('SELECT * FROM books WHERE id = ?', [id]);
          res.json(rows[0] || null);
        } else {
          const [rows] = await conn.query('SELECT * FROM books ORDER BY created_at DESC');
          res.json(rows);
        }
        conn.release();
        break;

      case 'POST':
        const { title, author, category, price, stocks, cover } = req.body;
        
        // Validate cover URL length
        if (cover && cover.length > 255) {
          res.status(400).json({ error: 'URL too long. Maximum length is 255 characters.' });
          conn.release();
          return;
        }
        
        const [result] = await conn.query(
          'INSERT INTO books (title, author, category, price, stocks, cover) VALUES (?, ?, ?, ?, ?, ?)',
          [title, author, category, price, stocks, cover || '']
        );
        res.json({ id: result.insertId, message: 'Book created' });
        conn.release();
        break;

      case 'PUT':
        const bookData = req.body;
        
        // Validate cover URL length
        if (bookData.cover && bookData.cover.length > 255) {
          res.status(400).json({ error: 'URL too long. Maximum length is 255 characters.' });
          conn.release();
          return;
        }
        
        await conn.query(
          'UPDATE books SET title=?, author=?, category=?, price=?, stocks=?, cover=? WHERE id=?',
          [bookData.title, bookData.author, bookData.category, bookData.price, bookData.stocks, bookData.cover || '', id]
        );
        res.json({ message: 'Book updated' });
        conn.release();
        break;

      case 'DELETE':
        await conn.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Book deleted' });
        conn.release();
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }

    conn.release();
  } catch (error) {
    console.error('Books error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============ USERS ============
async function handleUsers(req, res) {
  const { method } = req;
  const { id } = req.params;

  if (!checkDatabase(res)) return;

  try {
    const conn = await pool.getConnection();

    switch (method) {
      case 'GET':
        if (id) {
          const [rows] = await conn.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
          );
          res.json(rows[0] || null);
        } else {
          const [rows] = await conn.query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
          );
          res.json(rows);
        }
        conn.release();
        break;

      case 'PUT':
        const { role } = req.body;
        if (role) {
          await conn.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
          res.json({ message: 'User role updated' });
        }
        conn.release();
        break;

      case 'DELETE':
        await conn.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted' });
        conn.release();
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }

    conn.release();
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============ AUTH ============
async function handleAuth(req, res) {
  const { action } = req.params;
  const { email, password, name } = req.body;

  if (!checkDatabase(res)) return;

  try {
    const conn = await pool.getConnection();

    if (action === 'login') {
      const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];

      if (user && await bcrypt.compare(password, user.password)) {
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
      conn.release();
    } else if (action === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Only admin@webook.com can be admin, all others are users
      const role = email === 'admin@webook.com' ? 'admin' : 'user';

      try {
        const [result] = await conn.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, role]
        );

        res.json({
          user: {
            id: result.insertId,
            name,
            email,
            role,
          },
          message: 'Registration successful',
        });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: 'Email already exists' });
        } else {
          throw err;
        }
      }
      conn.release();
    }

    conn.release();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============ CART ============
async function handleCart(req, res) {
  const { method } = req;
  const { userId } = req.params;

  if (!checkDatabase(res)) return;

  try {
    const conn = await pool.getConnection();

    switch (method) {
      case 'GET':
        const [items] = await conn.query(
          `SELECT ci.*, b.title, b.author, b.price, b.cover, b.category 
           FROM cart_items ci 
           JOIN books b ON ci.book_id = b.id 
           WHERE ci.user_id = ?`,
          [userId]
        );
        res.json(items);
        break;

      case 'POST':
        const postData = req.body;
        await conn.query(
          `INSERT INTO cart_items (user_id, book_id, quantity) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE quantity = ?`,
          [postData.user_id, postData.book_id, postData.quantity, postData.quantity]
        );
        res.json({ message: 'Cart updated' });
        break;

      case 'DELETE':
        const deleteData = req.body;
        if (deleteData.book_id) {
          await conn.query('DELETE FROM cart_items WHERE user_id = ? AND book_id = ?', [userId, deleteData.book_id]);
        } else {
          await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        }
        res.json({ message: 'Cart item(s) removed' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }

    conn.release();
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Routes
app.get('/api/books', (req, res) => handleBooks(req, res));
app.post('/api/books', (req, res) => handleBooks(req, res));
app.get('/api/books/:id', (req, res) => handleBooks(req, res));
app.put('/api/books/:id', (req, res) => handleBooks(req, res));
app.delete('/api/books/:id', (req, res) => handleBooks(req, res));

app.get('/api/users', (req, res) => handleUsers(req, res));
app.get('/api/users/:id', (req, res) => handleUsers(req, res));
app.put('/api/users/:id', (req, res) => handleUsers(req, res));
app.delete('/api/users/:id', (req, res) => handleUsers(req, res));

app.post('/api/auth/:action', (req, res) => handleAuth(req, res));

app.get('/api/cart/:userId', (req, res) => handleCart(req, res));
app.post('/api/cart/:userId', (req, res) => handleCart(req, res));
app.delete('/api/cart/:userId', (req, res) => handleCart(req, res));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Serve React app for all other routes (catch-all for SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 WeBook API ready at http://localhost:${PORT}/api`);
});
