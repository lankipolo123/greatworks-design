-- =============================================================
-- Greatworks Design — SQL Script
-- Paste and run in phpMyAdmin / mysqli AFTER running migrations.
-- All passwords are: password
-- =============================================================

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
-- USERS
-- password hash = "password"
-- =============================================================
INSERT INTO users (id, name, email, phone, address, password, role, status, email_verified_at, created_at, updated_at) VALUES
(1,  'Super Admin',    'admin@greatworks.com',  '+63 917 000 0001', '1184 Quezon Ave, Diliman, Quezon City',          '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',     'active', NOW(), NOW(), NOW()),
(2,  'Maria Santos',   'maria@greatworks.com',  '+63 917 000 0002', 'Scout Rallos, Diliman, Quezon City',             '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moderator', 'active', NOW(), NOW(), NOW()),
(3,  'Juan dela Cruz', 'juan@email.com',         '+63 917 111 0001', '123 Rizal St, Quezon City',                      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(4,  'Ana Reyes',      'ana@email.com',          '+63 917 111 0002', '45 Bonifacio St, Mandaluyong',                   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(5,  'Carlos Mendoza', 'carlos@email.com',       '+63 917 111 0003', '78 EDSA, Mandaluyong',                           '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(6,  'Liza Villanueva','liza@email.com',          '+63 917 111 0004', '10 Shaw Blvd, Pasig',                            '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(7,  'Rico Fernandez', 'rico@email.com',          '+63 917 111 0005', '5 Ortigas Ave, San Juan',                        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(8,  'Cathy Torres',   'cathy@email.com',         '+63 917 111 0006', '22 Taft Ave, Manila',                            '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(9,  'Mark Aquino',    'mark@email.com',           '+63 917 111 0007', '88 Commonwealth Ave, Quezon City',              '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(10, 'Jenny Garcia',   'jenny@email.com',          '+63 917 111 0008', '3 Katipunan Ave, Quezon City',                  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(11, 'Paolo Ramos',    'paolo@email.com',           '+63 917 111 0009', '61 C. Palanca St, Makati',                     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'active', NOW(), NOW(), NOW()),
(12, 'Diana Cruz',     'diana@email.com',           '+63 917 111 0010', '14 Scout Borromeo, Quezon City',               '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer',  'inactive', NOW(), NOW(), NOW());

-- =============================================================
-- ROOMS
-- =============================================================
INSERT INTO rooms (id, location_id, name, type, capacity, price_per_hour, floor, amenities, description, status, created_at, updated_at) VALUES
-- Business Campus (3F, Main Building, Ben-Lor IT Center, 1184 Quezon Ave)
(1,  1, 'The Hub',         'co_working',          20, 150.00, '3F', '["WiFi","Aircon","Lockers","Coffee Bar","Standing Desks"]',      'Open co-working floor with 20 hot desks, natural lighting, and a fully stocked coffee bar.',           'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(2,  1, 'Flex Desk',       'co_working',          10, 100.00, '3F', '["WiFi","Aircon","Whiteboards","Monitor Rental"]',               'Compact co-working pod for focused work sessions. Ideal for solo professionals.',                    'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(3,  1, 'Executive Suite', 'private_offices',      4, 300.00, '3F', '["WiFi","Aircon","Private Phone Line","Mini Fridge","TV Screen"]','Fully enclosed private office for small teams. Includes a dedicated landline and mini fridge.',    'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(4,  1, 'The Arena',       'events_meeting_room', 50, 800.00, '3F', '["WiFi","Aircon","Projector","PA System","Stage","Catering Ready"]','Large event hall for conferences, workshops, and product launches. Seats up to 50 guests.',         'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),

-- Studio (2F, ABDC Building, Scout Rallos corner Scout Tuazon)
(5,  2, 'Colab Space',     'co_working',          15, 120.00, '2F', '["WiFi","Aircon","Phone Booths","Printer","Lounge Area"]',       'Creative co-working environment at Scout Rallos, Diliman. Ideal for freelancers and small teams.',   'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(6,  2, 'Virtual Box A',   'virtual_offices',      1,  50.00, '2F', '["WiFi","Aircon","Dedicated Address","Mail Handling"]',          'Virtual office with a Quezon City address and mail handling. Perfect for remote professionals.',      'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(7,  2, 'Virtual Box B',   'virtual_offices',      1,  50.00, '2F', '["WiFi","Aircon","Dedicated Address","Mail Handling"]',          'Virtual office with a Quezon City address and mail handling. Perfect for remote professionals.',      'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(8,  2, 'Boardroom',       'private_offices',      8, 400.00, '2F', '["WiFi","Aircon","55-inch TV","Whiteboard","Video Conferencing"]','Premium boardroom for executive meetings and client presentations. Fully equipped with AV.',           'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
(9,  2, 'Studio Hall',     'events_meeting_room', 30, 600.00, '2F', '["WiFi","Aircon","Dual Projectors","Podium","Breakout Tables"]',  'Professional event space ideal for seminars and large team meetings.',                              'available', '2026-01-05 09:00:00', '2026-01-05 09:00:00'),

-- Mega Tower (24F, 32F, 34F — SM Mega Tower, Ortigas Ave, Mandaluyong)
(10, 3, 'Open Deck',       'co_working',          25, 130.00, '24F','["WiFi","Aircon","City View","Pantry","Ergonomic Chairs"]',       'Expansive co-working floor on the 24th floor with panoramic Metro Manila views.',                    'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
(11, 3, 'Focus Room',      'private_offices',      4, 280.00, '32F','["WiFi","Aircon","Soundproofing","Dual Monitor Setup","Mini Fridge"]','Soundproof private office on the 32nd floor built for deep work and small team meetings.',          'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
(12, 3, 'Meeting Pod',     'events_meeting_room', 12, 250.00, '34F','["WiFi","Aircon","75-inch TV","Whiteboard","Video Conferencing"]', 'Premium meeting room on the 34th floor. Ideal for client meetings and small workshops.',             'available', '2026-01-10 09:00:00', '2026-01-10 09:00:00');

-- =============================================================
-- BOOKINGS  (spread across Jan–Feb 2026)
-- =============================================================
INSERT INTO bookings (id, user_id, room_id, date, start_time, duration_hours, guests, status, notes, created_at, updated_at) VALUES
-- Completed (past)
(1,  3,  1,  '2026-01-06', '09:00:00', 3,  5,  'completed', 'Team kickoff session',          '2026-01-04 10:00:00', '2026-01-06 12:00:00'),
(2,  4,  5,  '2026-01-07', '10:00:00', 2,  2,  'completed', 'Client meeting',                '2026-01-05 09:00:00', '2026-01-07 12:00:00'),
(3,  5,  8,  '2026-01-08', '13:00:00', 4,  6,  'completed', 'Board presentation',            '2026-01-06 11:00:00', '2026-01-08 17:00:00'),
(4,  6,  10, '2026-01-09', '08:00:00', 8,  10, 'completed', 'Full day co-working',           '2026-01-07 08:00:00', '2026-01-09 16:00:00'),
(5,  7,  3,  '2026-01-10', '14:00:00', 2,  3,  'completed', 'Product brainstorm',            '2026-01-08 09:00:00', '2026-01-10 16:00:00'),
(6,  8,  9,  '2026-01-13', '09:00:00', 6,  25, 'completed', 'All-hands meeting',             '2026-01-10 10:00:00', '2026-01-13 15:00:00'),
(7,  9,  1,  '2026-01-14', '10:00:00', 4,  8,  'completed', 'Workshop: Agile basics',        '2026-01-11 08:00:00', '2026-01-14 14:00:00'),
(8,  10, 12, '2026-01-15', '13:00:00', 2,  4,  'completed', 'Design review',                 '2026-01-12 13:00:00', '2026-01-15 15:00:00'),
(9,  11, 5,  '2026-01-16', '09:00:00', 3,  3,  'completed', 'Sales strategy session',        '2026-01-13 09:00:00', '2026-01-16 12:00:00'),
(10, 3,  4,  '2026-01-17', '10:00:00', 8,  40, 'completed', 'Company townhall 2026',         '2026-01-14 10:00:00', '2026-01-17 18:00:00'),
(11, 4,  2,  '2026-01-20', '08:00:00', 5,  8,  'completed', 'Developer hackathon',           '2026-01-17 08:00:00', '2026-01-20 13:00:00'),
(12, 5,  11, '2026-01-21', '14:00:00', 3,  2,  'completed', 'Focused writing session',       '2026-01-18 12:00:00', '2026-01-21 17:00:00'),
(13, 6,  8,  '2026-01-22', '09:00:00', 4,  7,  'completed', 'Investor pitch rehearsal',      '2026-01-19 10:00:00', '2026-01-22 13:00:00'),
(14, 7,  10, '2026-01-23', '10:00:00', 6,  15, 'completed', 'UX research workshop',          '2026-01-20 09:00:00', '2026-01-23 16:00:00'),
(15, 8,  3,  '2026-01-24', '13:00:00', 2,  4,  'completed', 'HR interviews',                 '2026-01-21 11:00:00', '2026-01-24 15:00:00'),
(16, 9,  9,  '2026-01-27', '09:00:00', 5,  20, 'completed', 'Q1 2026 planning',              '2026-01-24 09:00:00', '2026-01-27 14:00:00'),
(17, 10, 1,  '2026-01-28', '08:00:00', 8,  18, 'completed', 'Marketing sprint planning',     '2026-01-25 08:00:00', '2026-01-28 16:00:00'),
(18, 11, 5,  '2026-01-29', '10:00:00', 3,  5,  'completed', 'Startup mentoring session',     '2026-01-26 10:00:00', '2026-01-29 13:00:00'),
(19, 3,  12, '2026-01-30', '14:00:00', 2,  8,  'completed', 'Product demo rehearsal',        '2026-01-27 12:00:00', '2026-01-30 16:00:00'),
(20, 4,  4,  '2026-01-31', '09:00:00', 6,  30, 'completed', 'Annual kickoff event',          '2026-01-28 09:00:00', '2026-01-31 15:00:00'),

-- Confirmed (upcoming)
(21, 5,  1,  '2026-02-03', '09:00:00', 4,  6,  'confirmed', 'Team sprint session',           '2026-01-30 10:00:00', '2026-01-30 10:00:00'),
(22, 6,  8,  '2026-02-04', '10:00:00', 3,  5,  'confirmed', 'Client presentation',           '2026-01-31 09:00:00', '2026-01-31 09:00:00'),
(23, 7,  10, '2026-02-05', '13:00:00', 5,  12, 'confirmed', 'Product roadmap review',        '2026-02-01 10:00:00', '2026-02-01 10:00:00'),
(24, 8,  3,  '2026-02-06', '09:00:00', 2,  3,  'confirmed', 'Offsite legal review',          '2026-02-02 11:00:00', '2026-02-02 11:00:00'),
(25, 9,  9,  '2026-02-10', '09:00:00', 6,  22, 'confirmed', 'Tech conference day 1',         '2026-02-05 09:00:00', '2026-02-05 09:00:00'),
(26, 10, 4,  '2026-02-11', '10:00:00', 8,  45, 'confirmed', 'Tech conference day 2',         '2026-02-05 09:30:00', '2026-02-05 09:30:00'),
(27, 11, 11, '2026-02-12', '13:00:00', 3,  2,  'confirmed', 'Deep work session',             '2026-02-06 12:00:00', '2026-02-06 12:00:00'),
(28, 3,  5,  '2026-02-13', '09:00:00', 4,  8,  'confirmed', 'Sales pipeline review',         '2026-02-07 09:00:00', '2026-02-07 09:00:00'),
(29, 4,  12, '2026-02-17', '14:00:00', 2,  5,  'confirmed', 'Weekly team sync',              '2026-02-10 12:00:00', '2026-02-10 12:00:00'),
(30, 5,  2,  '2026-02-18', '08:00:00', 8,  9,  'confirmed', 'Full day hackathon',            '2026-02-11 08:00:00', '2026-02-11 08:00:00'),
(31, 6,  8,  '2026-02-19', '10:00:00', 3,  7,  'confirmed', 'Board meeting Q1',              '2026-02-12 10:00:00', '2026-02-12 10:00:00'),
(32, 7,  1,  '2026-02-20', '09:00:00', 4,  10, 'confirmed', 'Community networking event',    '2026-02-14 09:00:00', '2026-02-14 09:00:00'),

-- Pending (new requests)
(33, 8,  9,  '2026-02-21', '09:00:00', 4,  18, 'pending',   'All-team workshop',             '2026-02-17 11:00:00', '2026-02-17 11:00:00'),
(34, 9,  3,  '2026-02-24', '14:00:00', 2,  3,  'pending',   'Confidential meeting',          '2026-02-18 13:00:00', '2026-02-18 13:00:00'),
(35, 10, 10, '2026-02-25', '10:00:00', 6,  14, 'pending',   'Digital marketing workshop',    '2026-02-18 10:00:00', '2026-02-18 10:00:00'),
(36, 11, 4,  '2026-02-26', '09:00:00', 8,  48, 'pending',   'Product launch event',          '2026-02-19 09:00:00', '2026-02-19 09:00:00'),
(37, 3,  12, '2026-02-27', '13:00:00', 2,  6,  'pending',   'Retrospective meeting',         '2026-02-19 12:00:00', '2026-02-19 12:00:00'),

-- Cancelled
(38, 4,  5,  '2026-01-15', '09:00:00', 2,  3,  'cancelled', 'Cancelled due to schedule conflict',  '2026-01-12 08:00:00', '2026-01-13 10:00:00'),
(39, 5,  8,  '2026-01-22', '14:00:00', 3,  5,  'cancelled', 'Cancelled — client rescheduled',       '2026-01-18 09:00:00', '2026-01-20 11:00:00'),
(40, 6,  9,  '2026-02-05', '10:00:00', 4,  15, 'cancelled', 'Cancelled — venue changed',            '2026-02-01 10:00:00', '2026-02-03 08:00:00');

-- =============================================================
-- PAYMENTS  (linked to bookings)
-- =============================================================
INSERT INTO payments (id, user_id, booking_id, amount, currency, method, status, reference_number, created_at, updated_at) VALUES
-- Completed payments (bookings 1–20)
(1,  3,  1,  450.00,   'PHP', 'gcash',         'completed', 'GCH-20260106-0001',  '2026-01-06 12:30:00', '2026-01-06 12:30:00'),
(2,  4,  2,  240.00,   'PHP', 'credit_card',   'completed', 'CC-20260107-0002',   '2026-01-07 12:30:00', '2026-01-07 12:30:00'),
(3,  5,  3,  1600.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260108-0003',   '2026-01-08 17:30:00', '2026-01-08 17:30:00'),
(4,  6,  4,  1040.00,  'PHP', 'cash',          'completed', 'CASH-20260109-0004', '2026-01-09 16:30:00', '2026-01-09 16:30:00'),
(5,  7,  5,  600.00,   'PHP', 'gcash',         'completed', 'GCH-20260110-0005',  '2026-01-10 16:30:00', '2026-01-10 16:30:00'),
(6,  8,  6,  3600.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260113-0006',   '2026-01-13 15:30:00', '2026-01-13 15:30:00'),
(7,  9,  7,  600.00,   'PHP', 'credit_card',   'completed', 'CC-20260114-0007',   '2026-01-14 14:30:00', '2026-01-14 14:30:00'),
(8,  10, 8,  500.00,   'PHP', 'gcash',         'completed', 'GCH-20260115-0008',  '2026-01-15 15:30:00', '2026-01-15 15:30:00'),
(9,  11, 9,  360.00,   'PHP', 'debit_card',    'completed', 'DC-20260116-0009',   '2026-01-16 12:30:00', '2026-01-16 12:30:00'),
(10, 3,  10, 6400.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260117-0010',   '2026-01-17 18:30:00', '2026-01-17 18:30:00'),
(11, 4,  11, 500.00,   'PHP', 'gcash',         'completed', 'GCH-20260120-0011',  '2026-01-20 13:30:00', '2026-01-20 13:30:00'),
(12, 5,  12, 840.00,   'PHP', 'credit_card',   'completed', 'CC-20260121-0012',   '2026-01-21 17:30:00', '2026-01-21 17:30:00'),
(13, 6,  13, 1600.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260122-0013',   '2026-01-22 13:30:00', '2026-01-22 13:30:00'),
(14, 7,  14, 780.00,   'PHP', 'gcash',         'completed', 'GCH-20260123-0014',  '2026-01-23 16:30:00', '2026-01-23 16:30:00'),
(15, 8,  15, 600.00,   'PHP', 'cash',          'completed', 'CASH-20260124-0015', '2026-01-24 15:30:00', '2026-01-24 15:30:00'),
(16, 9,  16, 3000.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260127-0016',   '2026-01-27 14:30:00', '2026-01-27 14:30:00'),
(17, 10, 17, 1200.00,  'PHP', 'credit_card',   'completed', 'CC-20260128-0017',   '2026-01-28 16:30:00', '2026-01-28 16:30:00'),
(18, 11, 18, 360.00,   'PHP', 'gcash',         'completed', 'GCH-20260129-0018',  '2026-01-29 13:30:00', '2026-01-29 13:30:00'),
(19, 3,  19, 500.00,   'PHP', 'debit_card',    'completed', 'DC-20260130-0019',   '2026-01-30 16:30:00', '2026-01-30 16:30:00'),
(20, 4,  20, 4800.00,  'PHP', 'bank_transfer', 'completed', 'BT-20260131-0020',   '2026-01-31 15:30:00', '2026-01-31 15:30:00'),

-- Confirmed bookings payments (bookings 21–32)
(21, 5,  21, 600.00,   'PHP', 'gcash',         'completed', 'GCH-20260203-0021',  '2026-02-02 10:00:00', '2026-02-03 09:00:00'),
(22, 6,  22, 1200.00,  'PHP', 'credit_card',   'completed', 'CC-20260204-0022',   '2026-02-02 11:00:00', '2026-02-04 10:00:00'),
(23, 7,  23, 650.00,   'PHP', 'gcash',         'pending',   'GCH-20260205-0023',  '2026-02-03 10:00:00', '2026-02-03 10:00:00'),
(24, 8,  24, 600.00,   'PHP', 'bank_transfer', 'completed', 'BT-20260206-0024',   '2026-02-03 11:00:00', '2026-02-06 09:00:00'),
(25, 9,  25, 3600.00,  'PHP', 'bank_transfer', 'pending',   'BT-20260210-0025',   '2026-02-06 09:00:00', '2026-02-06 09:00:00'),
(26, 10, 26, 6400.00,  'PHP', 'bank_transfer', 'pending',   'BT-20260211-0026',   '2026-02-06 09:30:00', '2026-02-06 09:30:00'),
(27, 11, 27, 840.00,   'PHP', 'credit_card',   'completed', 'CC-20260212-0027',   '2026-02-07 12:00:00', '2026-02-12 13:00:00'),
(28, 3,  28, 480.00,   'PHP', 'gcash',         'completed', 'GCH-20260213-0028',  '2026-02-08 09:00:00', '2026-02-13 09:00:00'),
(29, 4,  29, 500.00,   'PHP', 'debit_card',    'pending',   'DC-20260217-0029',   '2026-02-11 12:00:00', '2026-02-11 12:00:00'),
(30, 5,  30, 800.00,   'PHP', 'gcash',         'pending',   'GCH-20260218-0030',  '2026-02-12 08:00:00', '2026-02-12 08:00:00'),

-- Refunded (cancelled bookings)
(31, 4,  38, 240.00,   'PHP', 'credit_card',   'refunded',  'CC-20260115-0031',   '2026-01-12 08:30:00', '2026-01-13 10:30:00'),
(32, 5,  39, 1200.00,  'PHP', 'bank_transfer', 'refunded',  'BT-20260122-0032',   '2026-01-18 09:30:00', '2026-01-20 11:30:00');

-- =============================================================
-- TICKETS  (booking-related requests only)
-- =============================================================
INSERT INTO tickets (id, user_id, subject, description, status, priority, created_at, updated_at) VALUES
(1,  3,  'Request to reschedule booking #1',                   'I need to reschedule my Jan 6 session in The Hub to Jan 8 instead. Please advise if the room is still available.',                              'closed',      'medium', '2026-01-04 15:00:00', '2026-01-05 10:00:00'),
(2,  4,  'Booking confirmation email not received for #2',     'I booked Colab Space for Jan 7 but have not received a confirmation email. Please verify that my booking is confirmed.',                       'closed',      'low',    '2026-01-05 11:00:00', '2026-01-06 09:00:00'),
(3,  5,  'Request to extend booking #3 by 2 hours',            'Our board presentation on Jan 8 is running longer than expected. Is it possible to extend Boardroom access by 2 additional hours?',            'closed',      'high',   '2026-01-08 15:30:00', '2026-01-08 16:00:00'),
(4,  6,  'Wrong room assigned for booking #4',                 'I booked an Open Deck co-working slot but was directed to a different room upon arrival. Please confirm my correct room assignment.',           'closed',      'high',   '2026-01-09 09:30:00', '2026-01-09 11:00:00'),
(5,  7,  'Request to add 2 more guests to booking #5',         'Our team grew. I need to add 2 more guests to my Executive Suite booking on Jan 10. Current booking is for 3 guests.',                         'closed',      'low',    '2026-01-08 10:00:00', '2026-01-09 08:00:00'),
(6,  8,  'Official receipt request for booking #6',            'Please issue an official receipt for our Studio Hall booking on Jan 13 (PHP 3,600). This is needed for reimbursement purposes.',               'closed',      'medium', '2026-01-13 16:00:00', '2026-01-14 10:00:00'),
(7,  9,  'Billing discrepancy for booking #7',                 'My payment for The Hub on Jan 14 was PHP 600 (4 hrs x PHP 150), but the receipt shows PHP 700. Please review and correct the charge.',         'closed',      'high',   '2026-01-14 15:00:00', '2026-01-15 09:00:00'),
(8,  10, 'Request to upgrade booking #8 to a private office',  'I would like to upgrade my Jan 15 Meeting Pod reservation to a private office if available. Please let me know the options.',                  'closed',      'medium', '2026-01-13 14:00:00', '2026-01-14 11:00:00'),
(9,  11, 'Request to reschedule booking #9 to next week',      'Due to a conflict, I need to move my Jan 16 Colab Space booking to Jan 23 at the same time. Please confirm availability.',                     'closed',      'medium', '2026-01-14 09:00:00', '2026-01-15 09:00:00'),
(10, 3,  'Early access request for booking #10',               'For the Jan 17 townhall in The Arena, we need 1-hour early access for setup. Can we access the room by 9 AM instead of 10 AM?',               'closed',      'high',   '2026-01-15 10:00:00', '2026-01-16 08:00:00'),
(11, 4,  'Request to extend booking #11 by 2 hours',           'Our hackathon in Flex Desk ran over time. Requesting a 2-hour extension for Jan 20. The room appeared to be free after our session.',          'closed',      'medium', '2026-01-20 14:00:00', '2026-01-20 16:00:00'),
(12, 5,  'Refund status for cancelled booking #39',            'It has been 7 business days since booking #39 was cancelled and I have not received my refund of PHP 1,200. Please provide an update.',         'in_progress', 'high',   '2026-02-01 10:00:00', '2026-02-10 09:00:00'),
(13, 6,  'Guest list amendment for booking #13',               'I need to increase the guest count for my Jan 22 Boardroom booking from 7 to 10 guests. Please confirm if the room can accommodate.',          'closed',      'low',    '2026-01-19 11:00:00', '2026-01-20 09:00:00'),
(14, 7,  'Booking #23 payment not reflecting as confirmed',    'I submitted payment via GCash for booking #23 (Feb 5, Open Deck) but the status still shows pending. Reference: GCH-20260205-0023.',            'in_progress', 'high',   '2026-02-04 11:00:00', '2026-02-10 08:00:00'),
(15, 8,  'Catering coordination for booking #26',              'For our Feb 11 tech conference (The Arena, 45 pax), we need catering arranged — lunch and AM/PM snacks. Please send options and pricing.',      'pending',     'medium', '2026-02-13 09:00:00', '2026-02-13 09:00:00'),
(16, 9,  'Request to extend booking #25 by 1 hour',            'Our Tech Conference Day 1 on Feb 10 at Studio Hall will likely run past 3 PM. Requesting a 1-hour extension. Please confirm availability.',     'pending',     'medium', '2026-02-09 14:00:00', '2026-02-09 14:00:00'),
(17, 10, 'Invoice request for booking #26',                    'Please send an official invoice for booking #26 (The Arena, Feb 11, PHP 6,400) addressed to our company for accounting purposes.',              'open',        'low',    '2026-02-12 10:00:00', '2026-02-12 10:00:00'),
(18, 11, 'Request for early check-in for booking #27',         'I have an early flight and need to access Focus Room at 12 PM instead of 1 PM for my Feb 12 session. Is early access possible?',               'open',        'low',    '2026-02-11 09:00:00', '2026-02-11 09:00:00'),
(19, 3,  'Amendment: increase guests on booking #28',          'I need to update my booking #28 (Colab Space, Feb 13) from 8 guests to 12. Please confirm if the space can accommodate the change.',           'open',        'medium', '2026-02-12 09:00:00', '2026-02-12 09:00:00'),
(20, 4,  'Booking certificate request for booking #29',        'Please issue a booking confirmation letter for booking #29 (Meeting Pod, Feb 17) addressed to my company. Required for client approval.',       'open',        'low',    '2026-02-14 11:00:00', '2026-02-14 11:00:00');
