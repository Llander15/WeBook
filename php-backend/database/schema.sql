-- WeBook Pro Database Schema
-- Run this in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS webook_db;
USE webook_db;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at DATE,
    updated_at DATE
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price REAL NOT NULL,
    stocks INT NOT NULL DEFAULT 0,
    cover VARCHAR(255),
    created_at DATE,
    updated_at DATE
);

-- Cart items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATE
);

-- Orders table (for checkout history)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount REAL NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATE
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase REAL NOT NULL
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@webook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Jane Doe', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('John Smith', 'john@smith.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert sample books
INSERT INTO books (title, author, category, price, stocks, cover) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 450.00, 15, 'https://images.unsplash.com/photo-1543004629-142a46460322?q=80&w=800'),
('Eloquent JavaScript', 'Marijn Haverbeke', 'Tech', 1200.00, 5, 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800'),
('Atomic Habits', 'James Clear', 'Self-Help', 890.00, 20, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800');
