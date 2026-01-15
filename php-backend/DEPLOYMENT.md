# WeBook Pro - Local LAMP Deployment Guide

## Quick Start (XAMPP)

### Step 1: Install XAMPP
Download from https://www.apachefriends.org/download.html

### Step 2: Start Services
Open XAMPP Control Panel and start:
- ✅ Apache
- ✅ MySQL

### Step 3: Create Database
1. Open http://localhost/phpmyadmin
2. Click "New" in the sidebar
3. Enter database name: `webook_db`
4. Click "Create"
5. Select `webook_db`, go to "Import" tab
6. Choose the `schema.sql` file and click "Go"

### Step 4: Deploy Files
Copy the `php-backend` folder to:
- **Windows**: `C:\xampp\htdocs\webook`
- **Linux**: `/opt/lampp/htdocs/webook`
- **Mac**: `/Applications/XAMPP/htdocs/webook`

### Step 5: Configure .htaccess
Create `.htaccess` in the webook folder:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php/$1 [L,QSA]
```

### Step 6: Access Your App
Open http://localhost/webook

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | Get all books |
| POST | /api/books | Create book |
| PUT | /api/books/{id} | Update book |
| DELETE | /api/books/{id} | Delete book |
| GET | /api/users | Get all users |
| PUT | /api/users/{id} | Update user role |
| DELETE | /api/users/{id} | Delete user |
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/cart/{userId} | Get user cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart/{userId} | Clear cart |

## Test Credentials
- **Admin**: admin@webook.com / password (any password works in demo)
- **User**: jane@example.com / password

## Troubleshooting

**"Connection refused"**
→ Make sure MySQL is running in XAMPP

**"Access denied for user 'root'"**
→ Check `config/database.php` credentials

**"Table doesn't exist"**
→ Import `schema.sql` in phpMyAdmin
