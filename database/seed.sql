-- =============================================================
-- Greatworks Design — MySQL Seed Data
-- Run this on your mysqli database AFTER running migrations.
-- All passwords are: password
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE activity_logs;
TRUNCATE TABLE payments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE reservations;
TRUNCATE TABLE bookings;
TRUNCATE TABLE rooms;
TRUNCATE TABLE locations;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- USERS
-- password hash = "password"
-- =============================================================
INSERT INTO users (id, name, email, phone, address, password, role, status, email_verified_at, created_at, updated_at) VALUES
(1,  'Super Admin',       'admin@greatworks.com',       '+63 917 000 0001', 'BGC, Taguig, Metro Manila',           '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',     'active', NOW(), NOW(), NOW()),
(2,  'Maria Santos',      'maria@greatworks.com',        '+63 917 000 0002', 'Makati City, Metro Manila',            '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moderator', 'active', NOW(), NOW(), NOW()),
(3,  'Juan dela Cruz',    'juan@email.com',              '+63 917 111 0001', '123 Rizal St, Quezon City',            '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(4,  'Ana Reyes',         'ana@email.com',               '+63 917 111 0002', '45 Bonifacio St, Makati',              '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(5,  'Carlos Mendoza',    'carlos@email.com',            '+63 917 111 0003', '78 EDSA, Mandaluyong',                 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(6,  'Liza Villanueva',   'liza@email.com',              '+63 917 111 0004', '10 Shaw Blvd, Pasig',                  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(7,  'Rico Fernandez',    'rico@email.com',              '+63 917 111 0005', '5 Ortigas Ave, San Juan',              '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(8,  'Cathy Torres',      'cathy@email.com',             '+63 917 111 0006', '22 Taft Ave, Manila',                  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(9,  'Mark Aquino',       'mark@email.com',              '+63 917 111 0007', '88 Commonwealth Ave, QC',              '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(10, 'Jenny Garcia',      'jenny@email.com',             '+63 917 111 0008', '3 Katipunan Ave, Quezon City',         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(11, 'Paolo Ramos',       'paolo@email.com',             '+63 917 111 0009', '61 C. Palanca St, Makati',             '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(12, 'Diana Cruz',        'diana@email.com',             '+63 917 111 0010', '14 Scout Borromeo, QC',                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'inactive', NOW(), NOW(), NOW());

-- =============================================================
-- LOCATIONS
-- =============================================================
INSERT INTO locations (id, name, address, city, state, zip_code, country, phone, email, description, status, created_at, updated_at) VALUES
(1, 'Greatwork Business Campus',
    '3rd Floor, Main Building, Ben-Lor IT Center, 1184 Quezon Avenue',
    'Quezon City', 'Metro Manila', '1100', 'Philippines',
    '+63 2 8888 1001', 'businesscampus@greatwork.com',
    'Our flagship location at Ben-Lor IT Center in Quezon Avenue, Diliman. Modern co-working floors and private offices for startups and professionals.',
    'active', '2026-01-05 08:00:00', '2026-01-05 08:00:00'),

(2, 'Greatwork Studio',
    '2nd Floor, ABDC Building, Scout Rallos corner Scout Tuazon',
    'Quezon City', 'Metro Manila', '1103', 'Philippines',
    '+63 2 8888 1002', 'studio@greatwork.com',
    'A creative and intimate workspace at Scout Rallos, Diliman. Perfect for freelancers, creatives, and small teams.',
    'active', '2026-01-05 08:00:00', '2026-01-05 08:00:00'),

(3, 'Greatwork Mega Tower',
    '24th, 32nd & 34th Floor, SM Mega Tower, Ortigas Avenue',
    'Mandaluyong', 'Metro Manila', '1550', 'Philippines',
    '+63 2 8888 1003', 'megatower@greatwork.com',
    'Premium high-rise offices at SM Mega Tower with panoramic Metro Manila views. Our largest and most prestigious location.',
    'active', '2026-01-10 08:00:00', '2026-01-10 08:00:00');

-- =============================================================
-- ROOMS
-- =============================================================
INSERT INTO rooms (id, location_id, name, type, capacity, price_per_hour, floor, amenities, description, status, created_at, updated_at) VALUES
-- Business Campus Rooms (3F, Main Building, Ben-Lor IT Center)
(1,  1, 'The Hub',          'co_working',          20, 150.00, '3F', '["WiFi","Aircon","Lockers","Coffee Bar","Standing Desks"]',      'Open co-working floor with 20 hot desks, natural lighting, and a fully stocked coffee bar.',        'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(2,  1, 'Flex Desk',        'co_working',          10, 100.00, '3F', '["WiFi","Aircon","Whiteboards","Monitor Rental"]',               'Compact co-working pod for focused work sessions. Ideal for solo professionals.',                 'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(3,  1, 'Executive Suite',  'private_offices',      4, 300.00, '3F', '["WiFi","Aircon","Private Phone Line","Mini Fridge","TV Screen"]','Fully enclosed private office for small teams. Includes a dedicated landline and mini fridge.', 'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(4,  1, 'The Arena',        'events_meeting_room', 50, 800.00, '3F', '["WiFi","Aircon","Projector","PA System","Stage","Catering Ready"]','Large event hall for conferences, workshops, and product launches. Seats up to 50 guests.',    'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),

-- Studio Rooms (2F, ABDC Building, Scout Rallos)
(5,  2, 'Colab Space',      'co_working',          15, 120.00, '2F', '["WiFi","Aircon","Phone Booths","Printer","Lounge Area"]',       'Creative co-working environment at Scout Rallos, Diliman. Ideal for freelancers and small teams.', 'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(6,  2, 'Virtual Box A',    'virtual_offices',      1,  50.00, '2F', '["WiFi","Aircon","Dedicated Address","Mail Handling"]',          'Virtual office with a Quezon City address and mail handling. Perfect for remote professionals.',   'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(7,  2, 'Virtual Box B',    'virtual_offices',      1,  50.00, '2F', '["WiFi","Aircon","Dedicated Address","Mail Handling"]',          'Virtual office with a Quezon City address and mail handling. Perfect for remote professionals.',   'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(8,  2, 'Boardroom',        'private_offices',      8, 400.00, '2F', '["WiFi","Aircon","55-inch TV","Whiteboard","Video Conferencing"]','Premium boardroom for executive meetings and client presentations. Fully equipped with AV.',      'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(9,  2, 'Conference Hall',  'events_meeting_room', 30, 600.00, '2F', '["WiFi","Aircon","Dual Projectors","Podium","Breakout Tables"]',  'Professional conference room ideal for seminars and large team meetings.',                       'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),

-- Mega Tower Rooms (24F, 32F, 34F — SM Mega Tower, Mandaluyong)
(10, 3, 'Open Deck',        'co_working',          25, 130.00, '24F','["WiFi","Aircon","City View","Pantry","Ergonomic Chairs"]',       'Expansive co-working floor on the 24th floor with panoramic Metro Manila views.',               'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
(11, 3, 'Focus Room',       'private_offices',      4, 280.00, '32F','["WiFi","Aircon","Soundproofing","Dual Monitor Setup","Mini Fridge"]','Soundproof private office on the 32nd floor built for deep work and small team meetings.',   'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
(12, 3, 'Meeting Pod',      'events_meeting_room', 12, 250.00, '34F','["WiFi","Aircon","75-inch TV","Whiteboard","Video Conferencing"]', 'Premium meeting room on the 34th floor. Ideal for client meetings and small workshops.',        'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00');

-- =============================================================
-- BOOKINGS  (spread across Jan–Feb 2026)
-- =============================================================
INSERT INTO bookings (id, user_id, room_id, date, start_time, duration_hours, guests, status, notes, created_at, updated_at) VALUES
-- Completed (past)
(1,  3,  1, '2026-01-06', '09:00:00', 3, 5,  'completed', 'Team kickoff session',                   '2026-01-04 10:00:00', '2026-01-06 12:00:00'),
(2,  4,  5, '2026-01-07', '10:00:00', 2, 2,  'completed', 'Client meeting',                         '2026-01-05 09:00:00', '2026-01-07 12:00:00'),
(3,  5,  8, '2026-01-08', '13:00:00', 4, 6,  'completed', 'Board presentation',                     '2026-01-06 11:00:00', '2026-01-08 17:00:00'),
(4,  6,  10,'2026-01-09', '08:00:00', 8, 10, 'completed', 'Full day co-working',                    '2026-01-07 08:00:00', '2026-01-09 16:00:00'),
(5,  7,  3, '2026-01-10', '14:00:00', 2, 3,  'completed', 'Product brainstorm',                     '2026-01-08 09:00:00', '2026-01-10 16:00:00'),
(6,  8,  9, '2026-01-13', '09:00:00', 6, 25, 'completed', 'All-hands meeting',                      '2026-01-10 10:00:00', '2026-01-13 15:00:00'),
(7,  9,  1, '2026-01-14', '10:00:00', 4, 8,  'completed', 'Workshop: Agile basics',                 '2026-01-11 08:00:00', '2026-01-14 14:00:00'),
(8,  10, 12,'2026-01-15', '13:00:00', 2, 4,  'completed', 'Design review',                          '2026-01-12 13:00:00', '2026-01-15 15:00:00'),
(9,  11, 5, '2026-01-16', '09:00:00', 3, 3,  'completed', 'Sales strategy session',                 '2026-01-13 09:00:00', '2026-01-16 12:00:00'),
(10, 3,  4, '2026-01-17', '10:00:00', 8, 40, 'completed', 'Company townhall 2026',                  '2026-01-14 10:00:00', '2026-01-17 18:00:00'),
(11, 4,  2, '2026-01-20', '08:00:00', 5, 8,  'completed', 'Developer hackathon',                    '2026-01-17 08:00:00', '2026-01-20 13:00:00'),
(12, 5,  11,'2026-01-21', '14:00:00', 3, 2,  'completed', 'Focused writing session',                '2026-01-18 12:00:00', '2026-01-21 17:00:00'),
(13, 6,  8, '2026-01-22', '09:00:00', 4, 7,  'completed', 'Investor pitch rehearsal',               '2026-01-19 10:00:00', '2026-01-22 13:00:00'),
(14, 7,  10,'2026-01-23', '10:00:00', 6, 15, 'completed', 'UX research workshop',                   '2026-01-20 09:00:00', '2026-01-23 16:00:00'),
(15, 8,  3, '2026-01-24', '13:00:00', 2, 4,  'completed', 'HR interviews',                          '2026-01-21 11:00:00', '2026-01-24 15:00:00'),
(16, 9,  9, '2026-01-27', '09:00:00', 5, 20, 'completed', 'Q1 2026 planning',                       '2026-01-24 09:00:00', '2026-01-27 14:00:00'),
(17, 10, 1, '2026-01-28', '08:00:00', 8, 18, 'completed', 'Marketing sprint planning',              '2026-01-25 08:00:00', '2026-01-28 16:00:00'),
(18, 11, 5, '2026-01-29', '10:00:00', 3, 5,  'completed', 'Startup mentoring session',              '2026-01-26 10:00:00', '2026-01-29 13:00:00'),
(19, 3,  12,'2026-01-30', '14:00:00', 2, 8,  'completed', 'Product demo rehearsal',                 '2026-01-27 12:00:00', '2026-01-30 16:00:00'),
(20, 4,  4, '2026-01-31', '09:00:00', 6, 30, 'completed', 'Annual kickoff event',                   '2026-01-28 09:00:00', '2026-01-31 15:00:00'),

-- Confirmed (recent/upcoming)
(21, 5,  1, '2026-02-03', '09:00:00', 4, 6,  'confirmed', 'Team sprint session',                    '2026-01-30 10:00:00', '2026-01-30 10:00:00'),
(22, 6,  8, '2026-02-04', '10:00:00', 3, 5,  'confirmed', 'Client presentation',                    '2026-01-31 09:00:00', '2026-01-31 09:00:00'),
(23, 7,  10,'2026-02-05', '13:00:00', 5, 12, 'confirmed', 'Product roadmap review',                 '2026-02-01 10:00:00', '2026-02-01 10:00:00'),
(24, 8,  3, '2026-02-06', '09:00:00', 2, 3,  'confirmed', 'Offsite legal review',                   '2026-02-02 11:00:00', '2026-02-02 11:00:00'),
(25, 9,  9, '2026-02-10', '09:00:00', 6, 22, 'confirmed', 'Tech conference day 1',                  '2026-02-05 09:00:00', '2026-02-05 09:00:00'),
(26, 10, 4, '2026-02-11', '10:00:00', 8, 45, 'confirmed', 'Tech conference day 2',                  '2026-02-05 09:30:00', '2026-02-05 09:30:00'),
(27, 11, 11,'2026-02-12', '13:00:00', 3, 2,  'confirmed', 'Deep work session',                      '2026-02-06 12:00:00', '2026-02-06 12:00:00'),
(28, 3,  5, '2026-02-13', '09:00:00', 4, 8,  'confirmed', 'Sales pipeline review',                  '2026-02-07 09:00:00', '2026-02-07 09:00:00'),
(29, 4,  12,'2026-02-17', '14:00:00', 2, 5,  'confirmed', 'Weekly team sync',                       '2026-02-10 12:00:00', '2026-02-10 12:00:00'),
(30, 5,  2, '2026-02-18', '08:00:00', 8, 9,  'confirmed', 'Full day hackathon',                     '2026-02-11 08:00:00', '2026-02-11 08:00:00'),
(31, 6,  8, '2026-02-19', '10:00:00', 3, 7,  'confirmed', 'Board meeting Q1',                       '2026-02-12 10:00:00', '2026-02-12 10:00:00'),
(32, 7,  1, '2026-02-20', '09:00:00', 4, 10, 'confirmed', 'Community networking event',             '2026-02-14 09:00:00', '2026-02-14 09:00:00'),

-- Pending (new requests)
(33, 8,  9, '2026-02-21', '09:00:00', 4, 18, 'pending',   'All-team workshop',                      '2026-02-17 11:00:00', '2026-02-17 11:00:00'),
(34, 9,  3, '2026-02-24', '14:00:00', 2, 3,  'pending',   'Confidential meeting',                   '2026-02-18 13:00:00', '2026-02-18 13:00:00'),
(35, 10, 10,'2026-02-25', '10:00:00', 6, 14, 'pending',   'Digital marketing workshop',             '2026-02-18 10:00:00', '2026-02-18 10:00:00'),
(36, 11, 4, '2026-02-26', '09:00:00', 8, 48, 'pending',   'Product launch event',                   '2026-02-19 09:00:00', '2026-02-19 09:00:00'),
(37, 3,  12,'2026-02-27', '13:00:00', 2, 6,  'pending',   'Retrospective meeting',                  '2026-02-19 12:00:00', '2026-02-19 12:00:00'),

-- Cancelled
(38, 4,  5, '2026-01-15', '09:00:00', 2, 3,  'cancelled', 'Cancelled due to schedule conflict',     '2026-01-12 08:00:00', '2026-01-13 10:00:00'),
(39, 5,  8, '2026-01-22', '14:00:00', 3, 5,  'cancelled', 'Cancelled — client rescheduled',         '2026-01-18 09:00:00', '2026-01-20 11:00:00'),
(40, 6,  9, '2026-02-05', '10:00:00', 4, 15, 'cancelled', 'Cancelled — venue changed',              '2026-02-01 10:00:00', '2026-02-03 08:00:00');

-- =============================================================
-- RESERVATIONS
-- =============================================================
INSERT INTO reservations (id, user_id, room_id, date, time, guests, status, notes, created_at, updated_at) VALUES
(1,  3,  6,  '2026-02-03', '09:00:00', 1, 'confirmed', 'Virtual office for February',   '2026-01-25 10:00:00', '2026-01-25 10:00:00'),
(2,  4,  7,  '2026-02-03', '09:00:00', 1, 'confirmed', 'Virtual office for February',   '2026-01-25 10:00:00', '2026-01-25 10:00:00'),
(3,  5,  6,  '2026-02-10', '09:00:00', 1, 'pending',   'Need virtual address for docs', '2026-02-05 11:00:00', '2026-02-05 11:00:00'),
(4,  7,  7,  '2026-02-17', '09:00:00', 1, 'pending',   'Monthly reservation',           '2026-02-10 09:00:00', '2026-02-10 09:00:00'),
(5,  9,  10, '2026-02-20', '10:00:00', 8, 'confirmed', 'Standing team reservation',     '2026-02-13 08:00:00', '2026-02-13 08:00:00'),
(6,  10, 1,  '2026-02-21', '08:00:00', 5, 'pending',   'Early access reservation',      '2026-02-17 09:00:00', '2026-02-17 09:00:00'),
(7,  11, 12, '2026-02-24', '13:00:00', 4, 'cancelled', 'Cancelled by client',           '2026-02-14 12:00:00', '2026-02-16 10:00:00'),
(8,  8,  5,  '2026-02-25', '09:00:00', 3, 'pending',   'Workshop reservation',          '2026-02-18 11:00:00', '2026-02-18 11:00:00');

-- =============================================================
-- PAYMENTS  (linked to completed & confirmed bookings)
-- =============================================================
INSERT INTO payments (id, user_id, booking_id, amount, currency, method, status, reference_number, created_at, updated_at) VALUES
-- Completed payments (completed bookings 1–20)
(1,  3,  1,  450.00,  'PHP', 'gcash',         'completed', 'GCH-20260106-0001', '2026-01-06 12:30:00', '2026-01-06 12:30:00'),
(2,  4,  2,  240.00,  'PHP', 'credit_card',   'completed', 'CC-20260107-0002',  '2026-01-07 12:30:00', '2026-01-07 12:30:00'),
(3,  5,  3,  1600.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260108-0003',  '2026-01-08 17:30:00', '2026-01-08 17:30:00'),
(4,  6,  4,  1040.00, 'PHP', 'cash',          'completed', 'CASH-20260109-0004','2026-01-09 16:30:00', '2026-01-09 16:30:00'),
(5,  7,  5,  600.00,  'PHP', 'gcash',         'completed', 'GCH-20260110-0005', '2026-01-10 16:30:00', '2026-01-10 16:30:00'),
(6,  8,  6,  3600.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260113-0006',  '2026-01-13 15:30:00', '2026-01-13 15:30:00'),
(7,  9,  7,  600.00,  'PHP', 'credit_card',   'completed', 'CC-20260114-0007',  '2026-01-14 14:30:00', '2026-01-14 14:30:00'),
(8,  10, 8,  500.00,  'PHP', 'gcash',         'completed', 'GCH-20260115-0008', '2026-01-15 15:30:00', '2026-01-15 15:30:00'),
(9,  11, 9,  360.00,  'PHP', 'debit_card',    'completed', 'DC-20260116-0009',  '2026-01-16 12:30:00', '2026-01-16 12:30:00'),
(10, 3,  10, 6400.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260117-0010',  '2026-01-17 18:30:00', '2026-01-17 18:30:00'),
(11, 4,  11, 500.00,  'PHP', 'gcash',         'completed', 'GCH-20260120-0011', '2026-01-20 13:30:00', '2026-01-20 13:30:00'),
(12, 5,  12, 840.00,  'PHP', 'credit_card',   'completed', 'CC-20260121-0012',  '2026-01-21 17:30:00', '2026-01-21 17:30:00'),
(13, 6,  13, 1600.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260122-0013',  '2026-01-22 13:30:00', '2026-01-22 13:30:00'),
(14, 7,  14, 780.00,  'PHP', 'gcash',         'completed', 'GCH-20260123-0014', '2026-01-23 16:30:00', '2026-01-23 16:30:00'),
(15, 8,  15, 600.00,  'PHP', 'cash',          'completed', 'CASH-20260124-0015','2026-01-24 15:30:00', '2026-01-24 15:30:00'),
(16, 9,  16, 3000.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260127-0016',  '2026-01-27 14:30:00', '2026-01-27 14:30:00'),
(17, 10, 17, 1200.00, 'PHP', 'credit_card',   'completed', 'CC-20260128-0017',  '2026-01-28 16:30:00', '2026-01-28 16:30:00'),
(18, 11, 18, 360.00,  'PHP', 'gcash',         'completed', 'GCH-20260129-0018', '2026-01-29 13:30:00', '2026-01-29 13:30:00'),
(19, 3,  19, 500.00,  'PHP', 'debit_card',    'completed', 'DC-20260130-0019',  '2026-01-30 16:30:00', '2026-01-30 16:30:00'),
(20, 4,  20, 4800.00, 'PHP', 'bank_transfer', 'completed', 'BT-20260131-0020',  '2026-01-31 15:30:00', '2026-01-31 15:30:00'),

-- Confirmed bookings (payments pending or completed)
(21, 5,  21, 600.00,  'PHP', 'gcash',         'completed', 'GCH-20260203-0021', '2026-02-02 10:00:00', '2026-02-03 09:00:00'),
(22, 6,  22, 1200.00, 'PHP', 'credit_card',   'completed', 'CC-20260204-0022',  '2026-02-02 11:00:00', '2026-02-04 10:00:00'),
(23, 7,  23, 650.00,  'PHP', 'gcash',         'pending',   'GCH-20260205-0023', '2026-02-03 10:00:00', '2026-02-03 10:00:00'),
(24, 8,  24, 600.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260206-0024',  '2026-02-03 11:00:00', '2026-02-06 09:00:00'),
(25, 9,  25, 3600.00, 'PHP', 'bank_transfer', 'pending',   'BT-20260210-0025',  '2026-02-06 09:00:00', '2026-02-06 09:00:00'),
(26, 10, 26, 6400.00, 'PHP', 'bank_transfer', 'pending',   'BT-20260211-0026',  '2026-02-06 09:30:00', '2026-02-06 09:30:00'),
(27, 11, 27, 840.00,  'PHP', 'credit_card',   'completed', 'CC-20260212-0027',  '2026-02-07 12:00:00', '2026-02-12 13:00:00'),
(28, 3,  28, 480.00,  'PHP', 'gcash',         'completed', 'GCH-20260213-0028', '2026-02-08 09:00:00', '2026-02-13 09:00:00'),
(29, 4,  29, 500.00,  'PHP', 'debit_card',    'pending',   'DC-20260217-0029',  '2026-02-11 12:00:00', '2026-02-11 12:00:00'),
(30, 5,  30, 800.00,  'PHP', 'gcash',         'pending',   'GCH-20260218-0030', '2026-02-12 08:00:00', '2026-02-12 08:00:00'),

-- Refunded (cancelled bookings)
(31, 4,  38, 240.00,  'PHP', 'credit_card',   'refunded',  'CC-20260115-0031',  '2026-01-12 08:30:00', '2026-01-13 10:30:00'),
(32, 5,  39, 1200.00, 'PHP', 'bank_transfer', 'refunded',  'BT-20260122-0032',  '2026-01-18 09:30:00', '2026-01-20 11:30:00');

-- =============================================================
-- TICKETS
-- =============================================================
INSERT INTO tickets (id, user_id, subject, description, status, priority, created_at, updated_at) VALUES
(1,  3,  'WiFi keeps dropping in The Hub',                    'During my 3-hour session today the WiFi disconnected 4 times. Very disruptive for video calls.',                                        'closed',      'high',   '2026-01-06 13:00:00', '2026-01-07 10:00:00'),
(2,  4,  'Air conditioning not working in Colab Space',       'The aircon in Colab Space was off when I arrived. Staff fixed it after 30 mins but it was uncomfortable.',                              'closed',      'medium', '2026-01-07 13:00:00', '2026-01-08 09:00:00'),
(3,  5,  'Projector in Boardroom malfunctioning',             'The HDMI cable in the Boardroom is broken. Couldn''t connect my laptop for the presentation. Need urgent replacement.',                  'closed',      'high',   '2026-01-08 18:00:00', '2026-01-09 08:00:00'),
(4,  6,  'Request for additional power outlets in Open Deck', 'There are only 5 power outlets for 25 desks in the Open Deck. Need at least 10 more extension cords.',                                  'in_progress', 'medium', '2026-01-09 17:00:00', '2026-01-15 10:00:00'),
(5,  7,  'Booking confirmation email not received',           'I booked Room 3 (Executive Suite) for Jan 10 but never received a confirmation email. Please verify my booking.',                        'closed',      'low',    '2026-01-09 15:00:00', '2026-01-10 08:00:00'),
(6,  8,  'Noise level too high during Conference Hall event', 'The event in the Conference Hall on Jan 13 was extremely loud and disrupted other tenants on the same floor.',                          'closed',      'medium', '2026-01-13 16:00:00', '2026-01-14 09:00:00'),
(7,  9,  'Coffee machine broken in The Hub',                  'The espresso machine in The Hub has been out of order for 3 days. This is one of the advertised amenities.',                            'closed',      'low',    '2026-01-14 15:00:00', '2026-01-16 11:00:00'),
(8,  10, 'Overcharged for booking #8',                        'I was charged PHP 500 but the booking was for 2 hours at PHP 250/hr. Receipt shows PHP 600. Please investigate.',                        'closed',      'high',   '2026-01-15 16:00:00', '2026-01-16 10:00:00'),
(9,  11, 'Locker combination reset request',                  'I forgot my locker combination in The Hub (locker #7). Please reset it.',                                                               'closed',      'low',    '2026-01-16 13:00:00', '2026-01-17 09:00:00'),
(10, 3,  'Event setup missing chairs for townhall',           'For the Jan 17 townhall in The Arena, only 30 chairs were set up for 40 guests. Had to scramble for extras.',                           'closed',      'high',   '2026-01-17 19:00:00', '2026-01-18 10:00:00'),
(11, 4,  'Request to extend booking #11 by 2 hours',         'Our hackathon ran over time. Requesting 2-hour extension for booking #11. Room appeared to be free after us.',                           'closed',      'medium', '2026-01-20 14:00:00', '2026-01-20 16:00:00'),
(12, 5,  'Printer not working in Colab Space',                'The printer on the 8th floor has been offline since Jan 21. I need to print documents for a client meeting.',                           'in_progress', 'medium', '2026-01-21 15:00:00', '2026-02-01 10:00:00'),
(13, 6,  'Request for parking slot validation',               'I was not informed that parking validation is only available on weekdays. Please update the website.',                                   'open',        'low',    '2026-02-01 11:00:00', '2026-02-01 11:00:00'),
(14, 7,  'Booking calendar shows wrong availability',         'The calendar shows Room 10 (Open Deck) as available on Feb 5 but I can see another booking exists. Please fix.',                        'in_progress', 'high',   '2026-02-05 09:30:00', '2026-02-10 08:00:00'),
(15, 8,  'Refund status for booking #39',                     'It has been 7 business days and my refund for booking #39 (PHP 1,200) has not been credited to my bank account.',                       'open',        'high',   '2026-02-10 10:00:00', '2026-02-10 10:00:00'),
(16, 9,  'Conference Hall AV system needs calibration',       'The audio in the Conference Hall has a loud echo during calls. This has been ongoing since the Feb 10 event.',                          'open',        'medium', '2026-02-11 16:00:00', '2026-02-11 16:00:00'),
(17, 10, 'Tech conference catering request',                  'For booking #26 (Feb 11, The Arena), we need catering for 45 pax — lunch and AM/PM snacks. Please coordinate.',                        'pending',     'medium', '2026-02-13 09:00:00', '2026-02-13 09:00:00'),
(18, 11, 'Cannot access booking portal on mobile',            'The booking portal doesn''t load properly on Safari/iOS. The calendar doesn''t render and the filters are broken.',                     'open',        'high',   '2026-02-15 14:00:00', '2026-02-15 14:00:00'),
(19, 3,  'Request for standing desk in The Hub',              'I''d like to request a standing desk for my regular bookings in The Hub. I have a back condition and this would help.',                  'pending',     'low',    '2026-02-17 10:00:00', '2026-02-17 10:00:00'),
(20, 4,  'Focus Room has flickering lights',                  'The ceiling lights in the Focus Room (Ortigas) have been flickering for 2 days. It''s causing eye strain.',                             'open',        'medium', '2026-02-19 11:00:00', '2026-02-19 11:00:00');

-- =============================================================
-- ACTIVITY LOGS
-- =============================================================
INSERT INTO activity_logs (id, user_id, action, module, ip_address, description, created_at, updated_at) VALUES
(1,  1,  'created',  'location',    '192.168.1.1',  'Created location: Greatworks BGC',                                 '2026-01-05 08:05:00', '2026-01-05 08:05:00'),
(2,  1,  'created',  'location',    '192.168.1.1',  'Created location: Greatworks Makati',                              '2026-01-05 08:10:00', '2026-01-05 08:10:00'),
(3,  1,  'created',  'location',    '192.168.1.1',  'Created location: Greatworks Ortigas',                             '2026-01-10 08:05:00', '2026-01-10 08:05:00'),
(4,  1,  'created',  'room',        '192.168.1.1',  'Created room: The Hub (BGC)',                                       '2026-01-05 09:05:00', '2026-01-05 09:05:00'),
(5,  1,  'created',  'room',        '192.168.1.1',  'Created room: The Arena (BGC)',                                     '2026-01-05 09:10:00', '2026-01-05 09:10:00'),
(6,  1,  'created',  'room',        '192.168.1.1',  'Created room: Boardroom (Makati)',                                  '2026-01-05 09:15:00', '2026-01-05 09:15:00'),
(7,  3,  'created',  'booking',     '203.177.10.5', 'Created booking #1 for The Hub on 2026-01-06',                     '2026-01-04 10:00:00', '2026-01-04 10:00:00'),
(8,  4,  'created',  'booking',     '203.177.10.6', 'Created booking #2 for Colab Space on 2026-01-07',                 '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(9,  5,  'created',  'booking',     '203.177.10.7', 'Created booking #3 for Boardroom on 2026-01-08',                   '2026-01-06 11:00:00', '2026-01-06 11:00:00'),
(10, 1,  'updated',  'booking',     '192.168.1.1',  'Updated booking #1 status to confirmed',                           '2026-01-04 11:00:00', '2026-01-04 11:00:00'),
(11, 1,  'updated',  'booking',     '192.168.1.1',  'Updated booking #1 status to completed',                           '2026-01-06 12:30:00', '2026-01-06 12:30:00'),
(12, 3,  'created',  'booking',     '203.177.10.5', 'Created booking #10 for The Arena — townhall event',               '2026-01-14 10:00:00', '2026-01-14 10:00:00'),
(13, 2,  'updated',  'booking',     '192.168.1.2',  'Updated booking #10 status to confirmed',                          '2026-01-14 11:00:00', '2026-01-14 11:00:00'),
(14, 4,  'created',  'booking',     '203.177.10.6', 'Created booking #38 for Colab Space on 2026-01-15',                '2026-01-12 08:00:00', '2026-01-12 08:00:00'),
(15, 4,  'updated',  'booking',     '203.177.10.6', 'Cancelled booking #38 — schedule conflict',                        '2026-01-13 10:00:00', '2026-01-13 10:00:00'),
(16, 3,  'created',  'ticket',      '203.177.10.5', 'Opened ticket #1: WiFi drops in The Hub',                          '2026-01-06 13:00:00', '2026-01-06 13:00:00'),
(17, 1,  'updated',  'ticket',      '192.168.1.1',  'Closed ticket #1: WiFi issue resolved',                            '2026-01-07 10:00:00', '2026-01-07 10:00:00'),
(18, 8,  'created',  'ticket',      '203.177.10.9', 'Opened ticket #8: Overcharged for booking #8',                     '2026-01-15 16:00:00', '2026-01-15 16:00:00'),
(19, 2,  'updated',  'ticket',      '192.168.1.2',  'Resolved ticket #8: Refund issued for PHP 100 overcharge',         '2026-01-16 10:00:00', '2026-01-16 10:00:00'),
(20, 3,  'created',  'booking',     '203.177.10.5', 'Created booking #28 for Colab Space on 2026-02-13',                '2026-02-07 09:00:00', '2026-02-07 09:00:00'),
(21, 1,  'created',  'user',        '192.168.1.1',  'Registered new admin account',                                     '2026-01-01 08:00:00', '2026-01-01 08:00:00'),
(22, 3,  'login',    'auth',        '203.177.10.5', 'User juan@email.com logged in',                                    '2026-02-19 08:55:00', '2026-02-19 08:55:00'),
(23, 4,  'login',    'auth',        '203.177.10.6', 'User ana@email.com logged in',                                     '2026-02-19 09:10:00', '2026-02-19 09:10:00'),
(24, 5,  'login',    'auth',        '203.177.10.7', 'User carlos@email.com logged in',                                  '2026-02-19 09:30:00', '2026-02-19 09:30:00'),
(25, 9,  'created',  'booking',     '203.177.10.11','Created booking #25 for Conference Hall — Tech conference day 1',  '2026-02-05 09:00:00', '2026-02-05 09:00:00'),
(26, 10, 'created',  'booking',     '203.177.10.12','Created booking #26 for The Arena — Tech conference day 2',        '2026-02-05 09:30:00', '2026-02-05 09:30:00'),
(27, 2,  'updated',  'booking',     '192.168.1.2',  'Updated booking #25 status to confirmed',                          '2026-02-05 11:00:00', '2026-02-05 11:00:00'),
(28, 2,  'updated',  'booking',     '192.168.1.2',  'Updated booking #26 status to confirmed',                          '2026-02-05 11:15:00', '2026-02-05 11:15:00'),
(29, 5,  'created',  'ticket',      '203.177.10.7', 'Opened ticket #12: Printer offline in Colab Space',                '2026-01-21 15:00:00', '2026-01-21 15:00:00'),
(30, 1,  'updated',  'room',        '192.168.1.1',  'Updated room status: Focus Room set to available',                 '2026-01-15 10:00:00', '2026-01-15 10:00:00'),
(31, 8,  'created',  'booking',     '203.177.10.9', 'Created booking #33 for Conference Hall on 2026-02-21',            '2026-02-17 11:00:00', '2026-02-17 11:00:00'),
(32, 9,  'created',  'booking',     '203.177.10.11','Created booking #34 for Executive Suite on 2026-02-24',            '2026-02-18 13:00:00', '2026-02-18 13:00:00'),
(33, 10, 'created',  'booking',     '203.177.10.12','Created booking #35 for Open Deck on 2026-02-25',                  '2026-02-18 10:00:00', '2026-02-18 10:00:00'),
(34, 11, 'created',  'booking',     '203.177.10.13','Created booking #36 for The Arena — product launch',               '2026-02-19 09:00:00', '2026-02-19 09:00:00'),
(35, 6,  'updated',  'booking',     '203.177.10.8', 'Cancelled booking #40 — venue changed',                            '2026-02-03 08:00:00', '2026-02-03 08:00:00'),
(36, 2,  'login',    'auth',        '192.168.1.2',  'Moderator maria@greatworks.com logged in',                         '2026-02-20 08:00:00', '2026-02-20 08:00:00'),
(37, 1,  'login',    'auth',        '192.168.1.1',  'Admin admin@greatworks.com logged in',                             '2026-02-20 07:55:00', '2026-02-20 07:55:00'),
(38, 11, 'created',  'ticket',      '203.177.10.13','Opened ticket #18: Mobile portal not loading on Safari',           '2026-02-15 14:00:00', '2026-02-15 14:00:00'),
(39, 4,  'created',  'ticket',      '203.177.10.6', 'Opened ticket #20: Flickering lights in Focus Room',               '2026-02-19 11:00:00', '2026-02-19 11:00:00'),
(40, 1,  'updated',  'location',    '192.168.1.1',  'Updated location info: Greatworks BGC phone number updated',       '2026-02-01 10:00:00', '2026-02-01 10:00:00');
