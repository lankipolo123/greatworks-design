<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Location;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ============================================
        // 1. CREATE USERS
        // ============================================

        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@greatworks.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '+63 917 123 4567',
            'address' => '123 Business Park, Makati City',
        ]);

        // Moderator user
        $moderator = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'moderator@greatworks.com',
            'password' => bcrypt('moderator123'),
            'role' => 'moderator',
            'status' => 'active',
            'phone' => '+63 917 234 5678',
            'address' => '456 Ayala Ave, Makati City',
        ]);

        // Customer users
        $customer1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'status' => 'active',
            'phone' => '+63 917 345 6789',
            'address' => '789 BGC, Taguig City',
        ]);

        $customer2 = User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'status' => 'active',
            'phone' => '+63 917 456 7890',
            'address' => '321 Ortigas Center, Pasig City',
        ]);

        $customer3 = User::create([
            'name' => 'David Chen',
            'email' => 'david@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'status' => 'active',
            'phone' => '+63 917 567 8901',
            'address' => '654 Quezon City',
        ]);

        // ============================================
        // 2. CREATE LOCATIONS
        // ============================================

        $locationMakati = Location::create([
            'name' => 'GreatWorks Makati',
            'address' => '123 Ayala Avenue',
            'city' => 'Makati',
            'state' => 'Metro Manila',
            'zip_code' => '1200',
            'country' => 'Philippines',
            'phone' => '+63 2 8123 4567',
            'email' => 'makati@greatworks.com',
            'description' => 'Premium coworking space in the heart of Makati CBD',
            'status' => 'active',
        ]);

        $locationBGC = Location::create([
            'name' => 'GreatWorks BGC',
            'address' => '456 26th Street',
            'city' => 'Taguig',
            'state' => 'Metro Manila',
            'zip_code' => '1634',
            'country' => 'Philippines',
            'phone' => '+63 2 8234 5678',
            'email' => 'bgc@greatworks.com',
            'description' => 'Modern workspace in Bonifacio Global City',
            'status' => 'active',
        ]);

        $locationOrtigas = Location::create([
            'name' => 'GreatWorks Ortigas',
            'address' => '789 EDSA',
            'city' => 'Pasig',
            'state' => 'Metro Manila',
            'zip_code' => '1605',
            'country' => 'Philippines',
            'phone' => '+63 2 8345 6789',
            'email' => 'ortigas@greatworks.com',
            'description' => 'Accessible coworking space in Ortigas Center',
            'status' => 'active',
        ]);

        // ============================================
        // 3. CREATE ROOMS
        // ============================================

        // Makati Location Rooms
        $room1 = Room::create([
            'name' => 'Executive Conference Room A',
            'type' => 'conference',
            'capacity' => 20,
            'price_per_hour' => 1500.00,
            'floor' => '15th Floor',
            'location_id' => $locationMakati->id,
            'image' => 'rooms/conference-a.jpg',
            'amenities' => ['Projector', 'Whiteboard', 'WiFi', 'Video Conference', 'Coffee Machine'],
            'description' => 'Spacious conference room with city view, perfect for board meetings',
            'status' => 'available',
        ]);

        $room2 = Room::create([
            'name' => 'Meeting Room B',
            'type' => 'meeting',
            'capacity' => 8,
            'price_per_hour' => 800.00,
            'floor' => '15th Floor',
            'location_id' => $locationMakati->id,
            'image' => 'rooms/meeting-b.jpg',
            'amenities' => ['TV Screen', 'Whiteboard', 'WiFi', 'Air Conditioning'],
            'description' => 'Comfortable meeting room for small teams',
            'status' => 'available',
        ]);

        $room3 = Room::create([
            'name' => 'Private Office 101',
            'type' => 'private_office',
            'capacity' => 4,
            'price_per_hour' => 600.00,
            'floor' => '14th Floor',
            'location_id' => $locationMakati->id,
            'image' => 'rooms/office-101.jpg',
            'amenities' => ['Desk', 'Ergonomic Chair', 'WiFi', 'Storage Cabinet', 'Window View'],
            'description' => 'Private office space for small teams or startups',
            'status' => 'available',
        ]);

        // BGC Location Rooms
        $room4 = Room::create([
            'name' => 'Hot Desk Zone',
            'type' => 'hot_desk',
            'capacity' => 1,
            'price_per_hour' => 150.00,
            'floor' => 'Ground Floor',
            'location_id' => $locationBGC->id,
            'image' => 'rooms/hot-desk.jpg',
            'amenities' => ['WiFi', 'Power Outlet', 'Common Area Access'],
            'description' => 'Flexible hot desk in open workspace',
            'status' => 'available',
        ]);

        $room5 = Room::create([
            'name' => 'Event Space Grand Hall',
            'type' => 'event_space',
            'capacity' => 100,
            'price_per_hour' => 3000.00,
            'floor' => '2nd Floor',
            'location_id' => $locationBGC->id,
            'image' => 'rooms/event-hall.jpg',
            'amenities' => ['Stage', 'Sound System', 'Projector', 'WiFi', 'Catering Area', 'Parking'],
            'description' => 'Large event space for conferences, workshops, and networking events',
            'status' => 'available',
        ]);

        // Ortigas Location Rooms
        $room6 = Room::create([
            'name' => 'Meeting Room C',
            'type' => 'meeting',
            'capacity' => 6,
            'price_per_hour' => 700.00,
            'floor' => '10th Floor',
            'location_id' => $locationOrtigas->id,
            'image' => 'rooms/meeting-c.jpg',
            'amenities' => ['Whiteboard', 'WiFi', 'TV Screen'],
            'description' => 'Cozy meeting room perfect for brainstorming sessions',
            'status' => 'available',
        ]);

        $room7 = Room::create([
            'name' => 'Private Office 201',
            'type' => 'private_office',
            'capacity' => 6,
            'price_per_hour' => 750.00,
            'floor' => '11th Floor',
            'location_id' => $locationOrtigas->id,
            'image' => 'rooms/office-201.jpg',
            'amenities' => ['Desks', 'Chairs', 'WiFi', 'Storage', 'Printer Access'],
            'description' => 'Dedicated office space with all essential amenities',
            'status' => 'available',
        ]);

        // ============================================
        // 4. CREATE BOOKINGS
        // ============================================

        $booking1 = Booking::create([
            'user_id' => $customer1->id,
            'room_id' => $room1->id,
            'date' => now()->addDays(2),
            'start_time' => '09:00',
            'duration_hours' => 4,
            'guests' => 15,
            'status' => 'confirmed',
            'notes' => 'Board meeting with investors',
        ]);

        $booking2 = Booking::create([
            'user_id' => $customer2->id,
            'room_id' => $room4->id,
            'date' => now()->addDays(1),
            'start_time' => '10:00',
            'duration_hours' => 8,
            'guests' => 1,
            'status' => 'confirmed',
            'notes' => 'Working on freelance project',
        ]);

        $booking3 = Booking::create([
            'user_id' => $customer3->id,
            'room_id' => $room2->id,
            'date' => now()->addDays(5),
            'start_time' => '14:00',
            'duration_hours' => 2,
            'guests' => 6,
            'status' => 'pending',
            'notes' => 'Team strategy planning',
        ]);

        $booking4 = Booking::create([
            'user_id' => $customer1->id,
            'room_id' => $room5->id,
            'date' => now()->addDays(10),
            'start_time' => '08:00',
            'duration_hours' => 10,
            'guests' => 80,
            'status' => 'confirmed',
            'notes' => 'Annual company conference',
        ]);

        // Past booking (completed)
        $booking5 = Booking::create([
            'user_id' => $customer2->id,
            'room_id' => $room3->id,
            'date' => now()->subDays(3),
            'start_time' => '13:00',
            'duration_hours' => 3,
            'guests' => 3,
            'status' => 'completed',
            'notes' => 'Client presentation',
        ]);

        // ============================================
        // 5. CREATE PAYMENTS
        // ============================================

        Payment::create([
            'user_id' => $customer1->id,
            'booking_id' => $booking1->id,
            'amount' => 6000.00, // 1500 x 4 hours
            'currency' => 'PHP',
            'method' => 'credit_card',
            'status' => 'completed',
            'reference_number' => 'PAY-' . strtoupper(uniqid()),
        ]);

        Payment::create([
            'user_id' => $customer2->id,
            'booking_id' => $booking2->id,
            'amount' => 1200.00, // 150 x 8 hours
            'currency' => 'PHP',
            'method' => 'gcash',
            'status' => 'completed',
            'reference_number' => 'PAY-' . strtoupper(uniqid()),
        ]);

        Payment::create([
            'user_id' => $customer3->id,
            'booking_id' => $booking3->id,
            'amount' => 1600.00, // 800 x 2 hours
            'currency' => 'PHP',
            'method' => 'gcash',
            'status' => 'pending',
            'reference_number' => 'PAY-' . strtoupper(uniqid()),
        ]);

        Payment::create([
            'user_id' => $customer1->id,
            'booking_id' => $booking4->id,
            'amount' => 30000.00, // 3000 x 10 hours
            'currency' => 'PHP',
            'method' => 'bank_transfer',
            'status' => 'completed',
            'reference_number' => 'PAY-' . strtoupper(uniqid()),
        ]);

        Payment::create([
            'user_id' => $customer2->id,
            'booking_id' => $booking5->id,
            'amount' => 1800.00, // 600 x 3 hours
            'currency' => 'PHP',
            'method' => 'cash',
            'status' => 'completed',
            'reference_number' => 'PAY-' . strtoupper(uniqid()),
        ]);

        // ============================================
        // 6. CREATE RESERVATIONS (SAMPLE)
        // ============================================

        Reservation::create([
            'user_id' => $customer3->id,
            'room_id' => $room6->id,
            'date' => now()->addDays(7),
            'time' => '15:00',
            'guests' => 5,
            'status' => 'confirmed',
            'notes' => 'Weekly team sync',
        ]);

        Reservation::create([
            'user_id' => $customer1->id,
            'room_id' => $room7->id,
            'date' => now()->addDays(3),
            'time' => '11:00',
            'guests' => 4,
            'status' => 'pending',
            'notes' => 'Interview sessions',
        ]);
    }
}
