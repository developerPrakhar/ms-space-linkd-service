create TABLE IF NOT EXISTS users(
 id INT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(100) NOT NULL UNIQUE,
 password VARCHAR(200) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

