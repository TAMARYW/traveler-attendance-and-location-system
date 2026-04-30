CREATE DATABASE IF NOT EXISTS hadassim_db;
USE hadassim_db;

CREATE TABLE IF NOT EXISTS Teachers (
    id VARCHAR(9) PRIMARY KEY, 
    full_name VARCHAR(100) NOT NULL,
    class_number INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Students (
    id VARCHAR(9) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    class_number INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(9) NOT NULL, 
    lat_deg INT NOT NULL,      
    lat_min INT NOT NULL,     
    lat_sec DECIMAL(10, 4) NOT NULL, 
    lon_deg INT NOT NULL,       
    lon_min INT NOT NULL,       
    lon_sec DECIMAL(10, 4) NOT NULL, 
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TRIGGER IF EXISTS check_user_exists;

DELIMITER //

CREATE TRIGGER check_user_exists
BEFORE INSERT ON Locations
FOR EACH ROW
BEGIN
    IF (NOT EXISTS (SELECT 1 FROM Students WHERE id = NEW.user_id)) AND 
       (NOT EXISTS (SELECT 1 FROM Teachers WHERE id = NEW.user_id)) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: user_id must exist in either Students or Teachers table';
    END IF;
END; //

DELIMITER ;