<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$db = $database->connect();

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$endpoint = $request[0] ?? '';
$id = $request[1] ?? null;

switch ($endpoint) {
    case 'books':
        handleBooks($db, $method, $id);
        break;
    case 'users':
        handleUsers($db, $method, $id);
        break;
    case 'auth':
        handleAuth($db, $method, $request);
        break;
    case 'cart':
        handleCart($db, $method, $id);
        break;
    default:
        echo json_encode(['error' => 'Endpoint not found']);
        http_response_code(404);
}

// ============ BOOKS ============
function handleBooks($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $db->prepare("SELECT * FROM books WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $db->query("SELECT * FROM books ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO books (title, author, category, price, stocks, cover) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['author'],
                $data['category'],
                $data['price'],
                $data['stocks'],
                $data['cover'] ?? ''
            ]);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Book created']);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("UPDATE books SET title=?, author=?, category=?, price=?, stocks=?, cover=? WHERE id=?");
            $stmt->execute([
                $data['title'],
                $data['author'],
                $data['category'],
                $data['price'],
                $data['stocks'],
                $data['cover'] ?? '',
                $id
            ]);
            echo json_encode(['message' => 'Book updated']);
            break;
            
        case 'DELETE':
            $stmt = $db->prepare("DELETE FROM books WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['message' => 'Book deleted']);
            break;
    }
}

// ============ USERS ============
function handleUsers($db, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $db->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['role'])) {
                $stmt = $db->prepare("UPDATE users SET role = ? WHERE id = ?");
                $stmt->execute([$data['role'], $id]);
                echo json_encode(['message' => 'User role updated']);
            }
            break;
            
        case 'DELETE':
            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['message' => 'User deleted']);
            break;
    }
}

// ============ AUTH ============
function handleAuth($db, $method, $request) {
    $action = $request[1] ?? '';
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'login') {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($data['password'], $user['password'])) {
            unset($user['password']);
            echo json_encode(['user' => $user, 'message' => 'Login successful']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } elseif ($action === 'register') {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = strpos($data['email'], 'admin') !== false ? 'admin' : 'user';
        
        try {
            $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $hashedPassword,
                $role
            ]);
            
            $userId = $db->lastInsertId();
            echo json_encode([
                'user' => [
                    'id' => $userId,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'role' => $role
                ],
                'message' => 'Registration successful'
            ]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists']);
        }
    }
}

// ============ CART ============
function handleCart($db, $method, $userId) {
    switch ($method) {
        case 'GET':
            $stmt = $db->prepare("
                SELECT ci.*, b.title, b.author, b.price, b.cover, b.category 
                FROM cart_items ci 
                JOIN books b ON ci.book_id = b.id 
                WHERE ci.user_id = ?
            ");
            $stmt->execute([$userId]);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("
                INSERT INTO cart_items (user_id, book_id, quantity) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE quantity = ?
            ");
            $stmt->execute([
                $data['user_id'],
                $data['book_id'],
                $data['quantity'],
                $data['quantity']
            ]);
            echo json_encode(['message' => 'Cart updated']);
            break;
            
        case 'DELETE':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['book_id'])) {
                $stmt = $db->prepare("DELETE FROM cart_items WHERE user_id = ? AND book_id = ?");
                $stmt->execute([$userId, $data['book_id']]);
            } else {
                $stmt = $db->prepare("DELETE FROM cart_items WHERE user_id = ?");
                $stmt->execute([$userId]);
            }
            echo json_encode(['message' => 'Cart item(s) removed']);
            break;
    }
}
