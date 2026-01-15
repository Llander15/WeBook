# WeBook Pro - PHP/MySQL Backend Guide

This folder contains the PHP/MySQL backend code for running WeBook Pro locally with LAMP/XAMPP.

## Setup Instructions

### 1. Prerequisites
- XAMPP/LAMPP installed (https://www.apachefriends.org/)
- PHP 7.4+ and MySQL 5.7+

### 2. Database Setup
1. Start MySQL from XAMPP Control Panel
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database called `webook_db`
4. Import `database/schema.sql`

### 3. File Structure
Copy the `php-backend` folder to your XAMPP htdocs:
```
C:\xampp\htdocs\webook\  (Windows)
/opt/lampp/htdocs/webook/  (Linux)
```

### 4. Configuration
Edit `config/database.php` with your MySQL credentials.

### 5. Access the App
Open http://localhost/webook in your browser.

## Files Overview
- `config/database.php` - Database connection
- `api/` - REST API endpoints
- `database/schema.sql` - Database schema
- `index.html` - Frontend (copy your mockup here)
