-- ============================================
-- POPULATE DATABASE - Run in phpMyAdmin
-- All user passwords: password123
-- ============================================

USE greatwork_db;


-- ============================================
-- ROOMS (27 rooms, no co_working)
-- ============================================

-- Location 1: GreatWork Studio
INSERT INTO rooms (name, type, capacity, price_per_hour, floor, location_id, image, description, status, created_at, updated_at) VALUES
('Virtual Office Suite A', 'virtual_offices', 1, 500.00, NULL, 1, 'https://placehold.co/600x400?text=Virtual+Office+A', 'Professional business address with mail handling', 'available', NOW(), NOW()),
('Virtual Office Suite B', 'virtual_offices', 1, 750.00, NULL, 1, 'https://placehold.co/600x400?text=Virtual+Office+B', 'Premium virtual office with dedicated phone line', 'available', NOW(), NOW()),
('Private Office 101', 'private_offices', 4, 350.00, '1st Floor', 1, 'https://placehold.co/600x400?text=Private+101', 'Small private office for teams of up to 4', 'available', NOW(), NOW()),
('Private Office 102', 'private_offices', 6, 500.00, '1st Floor', 1, 'https://placehold.co/600x400?text=Private+102', 'Medium private office with whiteboard and monitor', 'available', NOW(), NOW()),
('Private Office 201', 'private_offices', 2, 250.00, '2nd Floor', 1, 'https://placehold.co/600x400?text=Private+201', 'Compact private office for solo or duo use', 'available', NOW(), NOW()),
('Meeting Room 1', 'events_meeting_room', 8, 400.00, '1st Floor', 1, 'https://placehold.co/600x400?text=Meeting+Room+1', 'Standard meeting room with projector and whiteboard', 'available', NOW(), NOW()),
('Conference Room A', 'events_meeting_room', 20, 800.00, '2nd Floor', 1, 'https://placehold.co/600x400?text=Conference+A', 'Large conference room with AV setup', 'available', NOW(), NOW());

-- Location 2: GreatWork Business Campus
INSERT INTO rooms (name, type, capacity, price_per_hour, floor, location_id, image, description, status, created_at, updated_at) VALUES
('Virtual Office Standard', 'virtual_offices', 1, 500.00, NULL, 2, 'https://placehold.co/600x400?text=Virtual+Standard', 'Business address with mail handling and receptionist', 'available', NOW(), NOW()),
('Virtual Office Premium', 'virtual_offices', 1, 900.00, NULL, 2, 'https://placehold.co/600x400?text=Virtual+Premium', 'Premium virtual office with meeting room credits', 'available', NOW(), NOW()),
('Virtual Office Enterprise', 'virtual_offices', 1, 1200.00, NULL, 2, 'https://placehold.co/600x400?text=Virtual+Enterprise', 'Full-service virtual office with dedicated assistant', 'available', NOW(), NOW()),
('Private Office A1', 'private_offices', 4, 400.00, '1st Floor', 2, 'https://placehold.co/600x400?text=Office+A1', 'Corner office with window view for small teams', 'available', NOW(), NOW()),
('Private Office A2', 'private_offices', 6, 550.00, '1st Floor', 2, 'https://placehold.co/600x400?text=Office+A2', 'Mid-size office with meeting area', 'available', NOW(), NOW()),
('Private Office B1', 'private_offices', 8, 700.00, '2nd Floor', 2, 'https://placehold.co/600x400?text=Office+B1', 'Spacious office for growing teams', 'available', NOW(), NOW()),
('Executive Suite', 'private_offices', 3, 600.00, '3rd Floor', 2, 'https://placehold.co/600x400?text=Executive+Suite', 'Premium executive office with lounge area', 'available', NOW(), NOW()),
('Boardroom', 'events_meeting_room', 12, 600.00, '3rd Floor', 2, 'https://placehold.co/600x400?text=Boardroom', 'Executive boardroom with smart TV and video conferencing', 'available', NOW(), NOW()),
('Training Room', 'events_meeting_room', 30, 1000.00, '2nd Floor', 2, 'https://placehold.co/600x400?text=Training+Room', 'Large training room with classroom-style setup', 'available', NOW(), NOW()),
('Huddle Room', 'events_meeting_room', 6, 300.00, '1st Floor', 2, 'https://placehold.co/600x400?text=Huddle+Room', 'Quick huddle room for small team syncs', 'available', NOW(), NOW());

-- Location 3: GreatWork Mega Tower
INSERT INTO rooms (name, type, capacity, price_per_hour, floor, location_id, image, description, status, created_at, updated_at) VALUES
('Virtual Office Basic', 'virtual_offices', 1, 600.00, NULL, 3, 'https://placehold.co/600x400?text=Virtual+Basic', 'Ortigas business address with mail forwarding', 'available', NOW(), NOW()),
('Virtual Office Pro', 'virtual_offices', 1, 1000.00, NULL, 3, 'https://placehold.co/600x400?text=Virtual+Pro', 'Premium Ortigas address with dedicated receptionist', 'available', NOW(), NOW()),
('Tower Office 1001', 'private_offices', 4, 500.00, '10th Floor', 3, 'https://placehold.co/600x400?text=Office+1001', 'Modern private office with city skyline view', 'available', NOW(), NOW()),
('Tower Office 1002', 'private_offices', 6, 650.00, '10th Floor', 3, 'https://placehold.co/600x400?text=Office+1002', 'Mid-size office with built-in storage', 'available', NOW(), NOW()),
('Tower Office 1501', 'private_offices', 10, 900.00, '15th Floor', 3, 'https://placehold.co/600x400?text=Office+1501', 'Large team office with dedicated pantry area', 'available', NOW(), NOW()),
('Corner Suite 1502', 'private_offices', 3, 550.00, '15th Floor', 3, 'https://placehold.co/600x400?text=Corner+Suite', 'Premium corner suite with dual window views', 'available', NOW(), NOW()),
('Grand Conference Hall', 'events_meeting_room', 50, 1500.00, '5th Floor', 3, 'https://placehold.co/600x400?text=Grand+Hall', 'Full-size conference hall for events and seminars', 'available', NOW(), NOW()),
('Meeting Room Ortigas A', 'events_meeting_room', 10, 500.00, '10th Floor', 3, 'https://placehold.co/600x400?text=Meeting+A', 'Standard meeting room with presentation setup', 'available', NOW(), NOW()),
('Meeting Room Ortigas B', 'events_meeting_room', 8, 450.00, '10th Floor', 3, 'https://placehold.co/600x400?text=Meeting+B', 'Compact meeting room for client meetings', 'available', NOW(), NOW()),
('Event Space Rooftop', 'events_meeting_room', 100, 2500.00, 'Rooftop', 3, 'https://placehold.co/600x400?text=Rooftop+Event', 'Open-air rooftop event space for large gatherings', 'available', NOW(), NOW());


-- ============================================
-- 11 USERS (IDs 2-12)
-- Password for ALL: password123
-- 1 admin, 2 moderators, 8 customers
-- ============================================

INSERT INTO users (id, name, email, phone, address, password, role, status, location_id, created_at, updated_at) VALUES
(2,  'Maria Santos',      'maria.santos@email.com',      '09171234567', 'Quezon City, Metro Manila',   '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'admin',     'active', NULL, NOW(), NOW()),
(3,  'Juan Dela Cruz',    'juan.delacruz@email.com',     '09181234568', 'Cubao, Quezon City',          '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'moderator', 'active', 1,    NOW(), NOW()),
(4,  'Ana Reyes',         'ana.reyes@email.com',         '09191234569', 'Mandaluyong City',            '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'moderator', 'active', 2,    NOW(), NOW()),
(5,  'Carlos Garcia',     'carlos.garcia@email.com',     '09201234570', 'Makati City',                 '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(6,  'Patricia Lim',      'patricia.lim@email.com',      '09211234571', 'Pasig City',                  '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(7,  'Miguel Torres',     'miguel.torres@email.com',     '09221234572', 'Taguig City',                 '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(8,  'Sofia Villanueva',  'sofia.villanueva@email.com',  '09231234573', 'San Juan City',               '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(9,  'Rafael Mendoza',    'rafael.mendoza@email.com',    '09241234574', 'Marikina City',               '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(10, 'Isabella Cruz',     'isabella.cruz@email.com',     '09251234575', 'Antipolo, Rizal',             '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(11, 'Diego Aquino',      'diego.aquino@email.com',      '09261234576', 'Caloocan City',               '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW()),
(12, 'Camille Ramos',     'camille.ramos@email.com',     '09271234577', 'Commonwealth, Quezon City',   '$2y$12$1M1Y4CW9IkMyJ2liqXLLOOhdFXrXfaumrh//PL.9AcGi4NXFZ3F5a', 'customer',  'active', NULL, NOW(), NOW());


-- ============================================
-- BOOKINGS (20 bookings, IDs 1-20)
-- ============================================

INSERT INTO bookings (user_id, room_id, date, start_time, duration_hours, guests, status, notes, created_at, updated_at) VALUES
(5,  3,  '2026-01-15', '09:00:00', 3, 2,  'completed',  'Team strategy session',             '2026-01-10 08:00:00', '2026-01-15 12:00:00'),
(6,  6,  '2026-01-20', '14:00:00', 2, 5,  'completed',  'Client presentation',               '2026-01-18 10:00:00', '2026-01-20 16:00:00'),
(7,  15, '2026-01-25', '10:00:00', 4, 8,  'completed',  'Product launch meeting',             '2026-01-22 09:00:00', '2026-01-25 14:00:00'),
(8,  11, '2026-02-01', '08:00:00', 8, 3,  'completed',  'Full day office rental',             '2026-01-28 11:00:00', '2026-02-01 16:00:00'),
(9,  20, '2026-02-05', '13:00:00', 2, 4,  'completed',  'Interview sessions',                 '2026-02-03 14:00:00', '2026-02-05 15:00:00'),
(10, 24, '2026-02-08', '09:00:00', 5, 20, 'completed',  'Company seminar',                    '2026-02-05 08:00:00', '2026-02-08 14:00:00'),
(11, 4,  '2026-02-10', '10:00:00', 2, 3,  'cancelled',  'Cancelled due to schedule conflict', '2026-02-07 09:00:00', '2026-02-09 10:00:00'),
(12, 9,  '2026-02-12', '15:00:00', 1, 1,  'cancelled',  'Client postponed',                   '2026-02-10 13:00:00', '2026-02-11 08:00:00'),
(5,  7,  '2026-02-20', '10:00:00', 3, 10, 'confirmed',  'Board meeting',                      '2026-02-17 09:00:00', '2026-02-18 10:00:00'),
(6,  14, '2026-02-21', '09:00:00', 4, 2,  'confirmed',  'Executive work session',             '2026-02-19 11:00:00', '2026-02-20 08:00:00'),
(7,  21, '2026-02-21', '14:00:00', 2, 5,  'confirmed',  'Team sync meeting',                  '2026-02-19 15:00:00', '2026-02-20 09:00:00'),
(8,  25, '2026-02-22', '10:00:00', 3, 8,  'confirmed',  'Workshop session',                   '2026-02-20 10:00:00', '2026-02-21 08:00:00'),
(9,  5,  '2026-02-25', '09:00:00', 2, 1,  'pending',    'Solo work day',                      '2026-02-21 08:00:00', '2026-02-21 08:00:00'),
(10, 12, '2026-02-26', '13:00:00', 3, 4,  'pending',    'Design review session',              '2026-02-21 09:00:00', '2026-02-21 09:00:00'),
(11, 16, '2026-02-27', '10:00:00', 6, 15, 'pending',    'Full day training event',            '2026-02-21 10:00:00', '2026-02-21 10:00:00'),
(12, 22, '2026-02-28', '08:00:00', 8, 6,  'pending',    'Team offsite day',                   '2026-02-21 11:00:00', '2026-02-21 11:00:00'),
(5,  26, '2026-03-02', '14:00:00', 2, 7,  'pending',    'Client demo',                        '2026-02-21 12:00:00', '2026-02-21 12:00:00'),
(6,  1,  '2026-03-03', '09:00:00', 4, 1,  'pending',    'Virtual office setup consultation',  '2026-02-21 13:00:00', '2026-02-21 13:00:00'),
(7,  8,  '2026-03-05', '10:00:00', 2, 1,  'pending',    'Virtual office onboarding',          '2026-02-21 14:00:00', '2026-02-21 14:00:00'),
(8,  18, '2026-03-06', '11:00:00', 3, 1,  'pending',    'Virtual office orientation',         '2026-02-21 15:00:00', '2026-02-21 15:00:00');


-- ============================================
-- TICKETS (12 tickets, IDs 1-12)
-- ============================================

INSERT INTO tickets (user_id, location_id, subject, description, status, priority, created_at, updated_at) VALUES
(5,  1, 'WiFi connectivity issue',         'Internet keeps disconnecting in the 1st floor co-working area',                    'open',        'high',   '2026-02-20 09:00:00', '2026-02-20 09:00:00'),
(6,  1, 'Air conditioning too cold',       'The AC in Meeting Room 1 is set too low, very uncomfortable during long meetings', 'in_progress', 'medium', '2026-02-18 14:00:00', '2026-02-19 10:00:00'),
(7,  2, 'Projector not working',           'The projector in the Boardroom has a flickering display',                          'open',        'high',   '2026-02-21 08:00:00', '2026-02-21 08:00:00'),
(8,  2, 'Request for standing desk',       'Would like a standing desk option in Private Office A1',                           'pending',     'low',    '2026-02-15 11:00:00', '2026-02-16 09:00:00'),
(9,  3, 'Elevator maintenance needed',     'Elevator to 15th floor has been slow and making unusual noises',                   'in_progress', 'high',   '2026-02-17 10:00:00', '2026-02-18 08:00:00'),
(10, 3, 'Parking space inquiry',           'Is there available monthly parking for tenants at Mega Tower?',                    'closed',      'low',    '2026-02-10 13:00:00', '2026-02-11 09:00:00'),
(11, 1, 'Broken chair in co-working area', 'One of the ergonomic chairs on the 2nd floor has a broken armrest',                'pending',     'medium', '2026-02-19 16:00:00', '2026-02-20 08:00:00'),
(12, 2, 'Noise complaint',                 'Construction noise from adjacent building is disrupting work in Training Room',    'open',        'medium', '2026-02-21 10:00:00', '2026-02-21 10:00:00'),
(5,  3, 'Restroom maintenance',            'Restroom on 10th floor - soap dispenser empty and faucet dripping',                'in_progress', 'medium', '2026-02-16 15:00:00', '2026-02-17 08:00:00'),
(6,  2, 'Mail not forwarded',              'Virtual office mail has not been forwarded for the past 2 weeks',                  'open',        'high',   '2026-02-20 11:00:00', '2026-02-20 11:00:00'),
(9,  1, 'Power outlet not working',        'Two power outlets near window side of Open Desk Area A are dead',                  'pending',     'medium', '2026-02-21 07:00:00', '2026-02-21 07:00:00'),
(10, 3, 'Request for after-hours access',  'Need access to Tower Office 1001 on weekends for a project deadline',              'closed',      'low',    '2026-02-12 09:00:00', '2026-02-13 14:00:00');


-- ============================================
-- PAYMENTS (20 payments, linked to bookings 1-20, IDs 1-20)
-- ============================================

INSERT INTO payments (user_id, booking_id, amount, currency, method, status, reference_number, created_at, updated_at) VALUES
(5,  1,  1050.00, 'PHP', 'gcash',         'completed', 'GC-2026011501', '2026-01-10 08:30:00', '2026-01-10 08:35:00'),
(6,  2,  800.00,  'PHP', 'credit_card',   'completed', 'CC-2026012001', '2026-01-18 10:30:00', '2026-01-18 10:32:00'),
(7,  3,  4000.00, 'PHP', 'bank_transfer', 'completed', 'BT-2026012501', '2026-01-22 09:30:00', '2026-01-23 14:00:00'),
(8,  4,  3200.00, 'PHP', 'gcash',         'completed', 'GC-2026020101', '2026-01-28 11:30:00', '2026-01-28 11:33:00'),
(9,  5,  1000.00, 'PHP', 'cash',          'completed', 'CA-2026020501', '2026-02-03 14:30:00', '2026-02-05 13:00:00'),
(10, 6,  7500.00, 'PHP', 'bank_transfer', 'completed', 'BT-2026020801', '2026-02-05 08:30:00', '2026-02-06 10:00:00'),
(11, 7,  1000.00, 'PHP', 'gcash',         'refunded',  'GC-2026021001', '2026-02-07 09:30:00', '2026-02-09 11:00:00'),
(12, 8,  900.00,  'PHP', 'credit_card',   'refunded',  'CC-2026021201', '2026-02-10 13:30:00', '2026-02-11 09:00:00'),
(5,  9,  2400.00, 'PHP', 'debit_card',    'completed', 'DC-2026022001', '2026-02-17 09:30:00', '2026-02-17 09:33:00'),
(6,  10, 2400.00, 'PHP', 'gcash',         'completed', 'GC-2026022101', '2026-02-19 11:30:00', '2026-02-19 11:33:00'),
(7,  11, 1300.00, 'PHP', 'credit_card',   'completed', 'CC-2026022102', '2026-02-19 15:30:00', '2026-02-19 15:33:00'),
(8,  12, 1500.00, 'PHP', 'gcash',         'completed', 'GC-2026022201', '2026-02-20 10:30:00', '2026-02-20 10:33:00'),
(9,  13, 500.00,  'PHP', 'gcash',         'pending',   NULL,            '2026-02-21 08:30:00', '2026-02-21 08:30:00'),
(10, 14, 1650.00, 'PHP', 'credit_card',   'pending',   NULL,            '2026-02-21 09:30:00', '2026-02-21 09:30:00'),
(11, 15, 6000.00, 'PHP', 'bank_transfer', 'pending',   NULL,            '2026-02-21 10:30:00', '2026-02-21 10:30:00'),
(12, 16, 5200.00, 'PHP', 'cash',          'pending',   NULL,            '2026-02-21 11:30:00', '2026-02-21 11:30:00'),
(5,  17, 1000.00, 'PHP', 'gcash',         'pending',   NULL,            '2026-02-21 12:30:00', '2026-02-21 12:30:00'),
(6,  18, 2000.00, 'PHP', 'debit_card',    'pending',   NULL,            '2026-02-21 13:30:00', '2026-02-21 13:30:00'),
(7,  19, 1000.00, 'PHP', 'gcash',         'pending',   NULL,            '2026-02-21 14:30:00', '2026-02-21 14:30:00'),
(8,  20, 1800.00, 'PHP', 'credit_card',   'pending',   NULL,            '2026-02-21 15:30:00', '2026-02-21 15:30:00');


-- ============================================
-- ADDITIONAL BOOKINGS (15 more, IDs 21-35)
-- Gives each customer 4-5 total bookings
-- (Reservations share this table — no separate inserts needed)
-- ============================================

INSERT INTO bookings (user_id, room_id, date, start_time, duration_hours, guests, status, notes, created_at, updated_at) VALUES
-- Carlos Garcia (user 5) — now has 5 total
(5,  11, '2026-01-08', '10:00:00', 2, 3,  'completed',  'Office tour with potential investors',       '2026-01-05 09:00:00', '2026-01-08 12:00:00'),
(5,  20, '2026-02-14', '13:00:00', 4, 4,  'completed',  'Project kickoff at Mega Tower',             '2026-02-10 10:00:00', '2026-02-14 17:00:00'),
-- Patricia Lim (user 6) — now has 5 total
(6,  4,  '2026-01-12', '08:00:00', 6, 4,  'completed',  'Team onboarding at Private Office 102',     '2026-01-09 11:00:00', '2026-01-12 14:00:00'),
(6,  25, '2026-02-15', '10:00:00', 3, 6,  'completed',  'Client workshop at Ortigas meeting room',   '2026-02-12 08:00:00', '2026-02-15 13:00:00'),
-- Miguel Torres (user 7) — now has 5 total
(7,  6,  '2026-01-18', '14:00:00', 2, 6,  'completed',  'Sales pitch in Meeting Room 1',             '2026-01-15 10:00:00', '2026-01-18 16:00:00'),
(7,  13, '2026-02-18', '09:00:00', 8, 5,  'completed',  'Full day work session at Business Campus',  '2026-02-15 09:00:00', '2026-02-18 17:00:00'),
-- Sofia Villanueva (user 8) — now has 5 total
(8,  5,  '2026-01-22', '09:00:00', 3, 2,  'completed',  'Quiet office for proposal writing',         '2026-01-19 14:00:00', '2026-01-22 12:00:00'),
(8,  15, '2026-03-10', '10:00:00', 4, 10, 'pending',    'Department quarterly review at boardroom',   '2026-02-21 16:00:00', '2026-02-21 16:00:00'),
-- Rafael Mendoza (user 9) — now has 5 total
(9,  3,  '2026-01-28', '10:00:00', 2, 2,  'completed',  'Private office for client call',             '2026-01-25 08:00:00', '2026-01-28 12:00:00'),
(9,  17, '2026-03-08', '14:00:00', 3, 1,  'pending',    'Huddle room for quick team sync',            '2026-02-21 09:30:00', '2026-02-21 09:30:00'),
-- Isabella Cruz (user 10) — now has 5 total
(10, 7,  '2026-01-30', '10:00:00', 3, 12, 'completed',  'Conference room for company update',         '2026-01-27 09:00:00', '2026-01-30 13:00:00'),
(10, 19, '2026-03-12', '09:00:00', 2, 1,  'pending',    'Virtual office pro orientation',             '2026-02-21 10:30:00', '2026-02-21 10:30:00'),
-- Diego Aquino (user 11) — now has 4 total
(11, 22, '2026-01-20', '13:00:00', 5, 3,  'completed',  'Day use office at Corner Suite',             '2026-01-17 11:00:00', '2026-01-20 18:00:00'),
-- Camille Ramos (user 12) — now has 4 total
(12, 23, '2026-02-06', '14:00:00', 2, 1,  'cancelled',  'Meeting cancelled — rescheduled to March',   '2026-02-03 09:00:00', '2026-02-05 10:00:00'),
(12, 6,  '2026-03-15', '10:00:00', 2, 4,  'pending',    'Rescheduled client meeting',                 '2026-02-21 12:30:00', '2026-02-21 12:30:00');


-- ============================================
-- ADDITIONAL TICKETS (8 more)
-- Gives each customer 2-3 total tickets
-- ============================================

INSERT INTO tickets (user_id, location_id, subject, description, status, priority, created_at, updated_at) VALUES
(7,  1, 'Printer jammed on 1st floor',       'The shared printer near Private Office 101 keeps jamming on double-sided prints',      'pending',     'medium', '2026-02-19 09:00:00', '2026-02-19 09:00:00'),
(8,  3, 'Water dispenser empty',              'The water dispenser on the 10th floor has been empty since Monday',                    'open',        'low',    '2026-02-20 08:30:00', '2026-02-20 08:30:00'),
(11, 2, 'Booking calendar not syncing',       'My bookings at Business Campus dont show in the calendar sometimes',                  'open',        'high',   '2026-02-21 09:00:00', '2026-02-21 09:00:00'),
(12, 3, 'Rooftop event space inquiry',        'Looking to reserve the rooftop space for a company event — what are the requirements?','closed',      'low',    '2026-02-14 10:00:00', '2026-02-15 11:00:00'),
(12, 1, 'Guest WiFi password request',        'Need the guest WiFi credentials for client visitors at GreatWork Studio tomorrow',    'closed',      'medium', '2026-02-18 16:00:00', '2026-02-19 08:00:00'),
(7,  3, 'Conference hall AV setup request',   'Need AV equipment and mic setup for our seminar at Grand Conference Hall next week',   'in_progress', 'high',   '2026-02-20 14:00:00', '2026-02-21 09:00:00'),
(9,  2, 'Door lock malfunction',              'The electronic lock on Private Office B1 is not responding to key card',              'open',        'high',   '2026-02-21 11:00:00', '2026-02-21 11:00:00'),
(8,  1, 'Coffee machine broken',              'The coffee machine in the 2nd floor pantry area is not dispensing hot water',         'in_progress', 'low',    '2026-02-19 10:00:00', '2026-02-20 09:00:00');


-- ============================================
-- ADDITIONAL PAYMENTS (15 more, linked to bookings 21-35)
-- ============================================

INSERT INTO payments (user_id, booking_id, amount, currency, method, status, reference_number, created_at, updated_at) VALUES
-- Booking 21: Carlos (room 11, 2h, 400/hr = 800)
(5,  21, 800.00,  'PHP', 'credit_card',   'completed', 'CC-2026010801', '2026-01-05 09:30:00', '2026-01-05 09:33:00'),
-- Booking 22: Carlos (room 20, 4h, 500/hr = 2000)
(5,  22, 2000.00, 'PHP', 'gcash',         'completed', 'GC-2026021401', '2026-02-10 10:30:00', '2026-02-10 10:33:00'),
-- Booking 23: Patricia (room 4, 6h, 500/hr = 3000)
(6,  23, 3000.00, 'PHP', 'bank_transfer', 'completed', 'BT-2026011201', '2026-01-09 11:30:00', '2026-01-10 09:00:00'),
-- Booking 24: Patricia (room 25, 3h, 500/hr = 1500)
(6,  24, 1500.00, 'PHP', 'gcash',         'completed', 'GC-2026021501', '2026-02-12 08:30:00', '2026-02-12 08:33:00'),
-- Booking 25: Miguel (room 6, 2h, 400/hr = 800)
(7,  25, 800.00,  'PHP', 'debit_card',    'completed', 'DC-2026011801', '2026-01-15 10:30:00', '2026-01-15 10:33:00'),
-- Booking 26: Miguel (room 13, 8h, 700/hr = 5600)
(7,  26, 5600.00, 'PHP', 'bank_transfer', 'completed', 'BT-2026021801', '2026-02-15 09:30:00', '2026-02-16 10:00:00'),
-- Booking 27: Sofia (room 5, 3h, 250/hr = 750)
(8,  27, 750.00,  'PHP', 'cash',          'completed', 'CA-2026012201', '2026-01-19 14:30:00', '2026-01-22 09:00:00'),
-- Booking 28: Sofia (room 15, 4h, 600/hr = 2400)
(8,  28, 2400.00, 'PHP', 'credit_card',   'pending',   NULL,            '2026-02-21 16:30:00', '2026-02-21 16:30:00'),
-- Booking 29: Rafael (room 3, 2h, 350/hr = 700)
(9,  29, 700.00,  'PHP', 'gcash',         'completed', 'GC-2026012801', '2026-01-25 08:30:00', '2026-01-25 08:33:00'),
-- Booking 30: Rafael (room 17, 3h, 300/hr = 900)
(9,  30, 900.00,  'PHP', 'debit_card',    'pending',   NULL,            '2026-02-21 09:45:00', '2026-02-21 09:45:00'),
-- Booking 31: Isabella (room 7, 3h, 800/hr = 2400)
(10, 31, 2400.00, 'PHP', 'bank_transfer', 'completed', 'BT-2026013001', '2026-01-27 09:30:00', '2026-01-28 11:00:00'),
-- Booking 32: Isabella (room 19, 2h, 1000/hr = 2000)
(10, 32, 2000.00, 'PHP', 'gcash',         'pending',   NULL,            '2026-02-21 10:45:00', '2026-02-21 10:45:00'),
-- Booking 33: Diego (room 22, 5h, 550/hr = 2750)
(11, 33, 2750.00, 'PHP', 'credit_card',   'completed', 'CC-2026012001', '2026-01-17 11:30:00', '2026-01-17 11:33:00'),
-- Booking 34: Camille (room 23, 2h, 1500/hr = 3000) — cancelled/refunded
(12, 34, 3000.00, 'PHP', 'gcash',         'refunded',  'GC-2026020601', '2026-02-03 09:30:00', '2026-02-05 11:00:00'),
-- Booking 35: Camille (room 6, 2h, 400/hr = 800)
(12, 35, 800.00,  'PHP', 'cash',          'pending',   NULL,            '2026-02-21 12:45:00', '2026-02-21 12:45:00');
