create TABLE IF NOT EXISTS properties(
 id INT PRIMARY KEY AUTO_INCREMENT,
 user_id INT NOT NULL,
 title VARCHAR(100) NOT NULL UNIQUE,
 decription VARCHAR(200) NOT NULL,
 address VARCHAR(200) NOT NULL,
 price TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

