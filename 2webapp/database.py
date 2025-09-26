import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE = 'esophai.db'

def init_db():
    """Initialize the database with users table"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            original_filename VARCHAR(255),
            prediction VARCHAR(255),
            confidence FLOAT,
            image_path VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Insert demo users if they don't exist
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
    if cursor.fetchone()[0] == 0:
        admin_hash = generate_password_hash('password123')
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, first_name, last_name, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('admin', 'admin@esophai.com', admin_hash, 'Admin', 'User', 'admin'))
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'user'")
    if cursor.fetchone()[0] == 0:
        user_hash = generate_password_hash('password123')
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, first_name, last_name, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('user', 'user@esophai.com', user_hash, 'Regular', 'User', 'user'))
    
    conn.commit()
    conn.close()

def get_user_by_username(username):
    """Get user by username or email"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, username, email, password_hash, first_name, last_name, role, created_at
        FROM users WHERE username = ? OR email = ?
    ''', (username, username))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'password_hash': user[3],
            'first_name': user[4],
            'last_name': user[5],
            'role': user[6],
            'created_at': user[7]
        }
    return None

def create_user(username, email, password_hash, first_name, last_name):
    """Create a new user"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (username, email, password_hash, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, email, password_hash, first_name, last_name))
    conn.commit()
    conn.close()

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, username, email, first_name, last_name, role, created_at
        FROM users WHERE id = ?
    ''', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'first_name': user[3],
            'last_name': user[4],
            'role': user[5],
            'created_at': user[6]
        }
    return None

def save_analysis(user_id, original_filename, prediction, confidence, image_path):
    """Save analysis result to database"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO analyses (user_id, original_filename, prediction, confidence, image_path)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, original_filename, prediction, confidence, image_path))
    conn.commit()
    conn.close()

def get_user_analyses(user_id):
    """Get all analyses for a user"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, original_filename, prediction, confidence, created_at
        FROM analyses WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
    ''', (user_id,))
    analyses = cursor.fetchall()
    conn.close()
    
    return [{
        'id': row[0],
        'original_filename': row[1],
        'prediction': row[2],
        'confidence': row[3],
        'created_at': row[4]
    } for row in analyses]

def get_user_stats(user_id):
    """Get user statistics"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM analyses WHERE user_id = ?', (user_id,))
    total_analyses = cursor.fetchone()[0]
    
    conn.close()
    return {'total_analyses': total_analyses}

def get_admin_stats():
    """Get admin statistics"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM users')
    total_users = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM analyses')
    total_analyses = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        'total_users': total_users,
        'total_analyses': total_analyses
    }
