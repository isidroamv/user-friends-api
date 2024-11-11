-- Create a new database if it doesn't exist
CREATE DATABASE IF NOT EXISTS app_db;

-- Use the new database
USE app_db;

-- Drop tables if they exist to ensure a clean start
DROP TABLE IF EXISTS user_friends;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the user_friends table to track friendships
-- This table establishes a many-to-many relationship between users
CREATE TABLE user_friends (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    since DATE,
    
    -- Constraints to ensure user_id and friend_id point to valid users
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,

    -- To prevent duplicate friendships, enforce uniqueness on (user_id, friend_id)
    UNIQUE (user_id, friend_id),

    -- Optional: Add a constraint to ensure user_id != friend_id to prevent self-friendship
    CHECK (user_id != friend_id)
);

-- Insert sample data into users table
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Charlie', 'charlie@example.com');
INSERT INTO users (name, email) VALUES ('David', 'david@example.com');
INSERT INTO users (name, email) VALUES ('Eve', 'eve@example.com');

-- Insert sample friendships
INSERT INTO user_friends (user_id, friend_id, since) VALUES (1, 2, '2023-01-01');
INSERT INTO user_friends (user_id, friend_id, since) VALUES (1, 3, '2023-02-15');
INSERT INTO user_friends (user_id, friend_id, since) VALUES (2, 3, '2023-03-10');
INSERT INTO user_friends (user_id, friend_id, since) VALUES (3, 4, '2023-04-20');
INSERT INTO user_friends (user_id, friend_id, since) VALUES (4, 5, '2023-05-05');
