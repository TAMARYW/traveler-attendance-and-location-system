USE hadassim_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Locations;
TRUNCATE TABLE Students;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Students (id, full_name, class_number)
VALUES 
('222222222', 'Ayala', 1),
('333333333', 'Tovi', 1),
('444444444', 'Noam', 1),
('555555555', 'Libi', 2),
('666666666', 'Tamar', 2),
('777777777', 'Roni', 1),
('888888888', 'Tomi', 3),
('999999999', 'Adi', 3),
('121212121', 'Mai', 1),
('131313131', 'Sarit', 2);

INSERT INTO Locations (user_id, lat_deg, lat_min, lat_sec, lon_deg, lon_min, lon_sec, recorded_at)
VALUES 
('222222222', 32, 4, 50.5, 34, 46, 44.2, NOW()), 
('333333333', 31, 46, 43.0, 35, 12, 45.0, NOW()),
('444444444', 32, 47, 10.2, 34, 59, 12.5, NOW()),
('555555555', 29, 33, 0.0, 34, 57, 0.0, NOW()), 
('666666666', 31, 15, 0.0, 34, 47, 0.0, NOW()),
('777777777', 32, 53, 0.0, 35, 4, 0.0, NOW()), 
('888888888', 32, 28, 0.0, 34, 51, 0.0, NOW()),
('999999999', 31, 53, 0.0, 34, 48, 0.0, NOW()), 
('121212121', 32, 5, 0.0, 34, 53, 0.0, NOW()),
('123456789', 32, 5, 0.0, 34, 48, 0.0, NOW()),
('131313131', 32, 41, 0.0, 35, 5, 0.0, NOW()); 