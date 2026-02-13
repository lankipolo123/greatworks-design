<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Location;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
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
        $this->command->info('🌱 Starting database seeding...');

        // Create Admin User
        $this->command->info('👤 Creating admin user...');
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@greatworks.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
        $this->command->info("✅ Admin created: {$admin->email} / password");

        // Create Regular Users
        $this->command->info('👥 Creating 100 regular users...');
        $users = User::factory(100)->create();
        $this->command->info('✅ Users created');

        // Create Locations
        $this->command->info('🏢 Creating 12 locations...');
        $locations = Location::factory(12)->create();
        $this->command->info('✅ Locations created');

        // Create Rooms for each location
        $this->command->info('🚪 Creating rooms for each location...');
        $allRooms = collect();

        foreach ($locations as $location) {
            $this->command->info("  📍 {$location->name}");

            // Create different types of rooms per location
            $coworkingRooms = Room::factory(5)
                ->forLocation($location)
                ->ofType('Co-Working Space')
                ->create();

            $meetingRooms = Room::factory(8)
                ->forLocation($location)
                ->ofType('Meeting Rooms')
                ->create();

            $privateOffices = Room::factory(6)
                ->forLocation($location)
                ->ofType('Private Offices')
                ->create();

            $virtualOffices = Room::factory(3)
                ->forLocation($location)
                ->ofType('Virtual Offices')
                ->create();

            $eventSpaces = Room::factory(2)
                ->forLocation($location)
                ->ofType('Event Spaces')
                ->create();

            $allRooms = $allRooms->merge($coworkingRooms)
                                 ->merge($meetingRooms)
                                 ->merge($privateOffices)
                                 ->merge($virtualOffices)
                                 ->merge($eventSpaces);
        }
        $this->command->info("✅ Total rooms created: {$allRooms->count()}");

        // Create Bookings
        $this->command->info('📅 Creating 1000 bookings with various statuses...');

        // Past bookings (completed) - 2 months ago to yesterday
        $pastBookings = Booking::factory(300)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->completed()
            ->create([
                'date' => fake()->dateTimeBetween('-60 days', '-1 day'),
            ]);

        // Current/upcoming bookings (confirmed) - today to 2 months ahead
        $confirmedBookings = Booking::factory(400)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->confirmed()
            ->create([
                'date' => fake()->dateTimeBetween('now', '+60 days'),
            ]);

        // Pending bookings
        $pendingBookings = Booking::factory(150)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->pending()
            ->create([
                'date' => fake()->dateTimeBetween('now', '+60 days'),
            ]);

        // Cancelled bookings
        $cancelledBookings = Booking::factory(150)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->cancelled()
            ->create([
                'date' => fake()->dateTimeBetween('-30 days', '+30 days'),
            ]);

        $allBookings = $pastBookings
            ->merge($confirmedBookings)
            ->merge($pendingBookings)
            ->merge($cancelledBookings);

        $this->command->info('✅ Bookings created');

        // Create Payments for confirmed and completed bookings
        $this->command->info('💳 Creating payments...');
        $bookingsWithPayments = $allBookings->filter(fn($booking) =>
            in_array($booking->status, ['confirmed', 'completed'])
        );

        foreach ($bookingsWithPayments as $booking) {
            Payment::factory()
                ->forBooking($booking)
                ->completed()
                ->create([
                    'amount' => $booking->room->price_per_hour * $booking->duration_hours,
                ]);
        }
        $this->command->info("✅ Payments created: {$bookingsWithPayments->count()}");

        // Create some Reservations
        $this->command->info('🔄 Creating 100 reservations...');
        Reservation::factory(100)
            ->recycle($users)
            ->recycle($allRooms)
            ->confirmed()
            ->create();
        $this->command->info('✅ Reservations created');

        // Summary
        $this->command->newLine();
        $this->command->info('✨ Seeding completed successfully!');
        $this->command->newLine();
        $this->command->table(
            ['Resource', 'Count'],
            [
                ['Users', User::count()],
                ['Locations', Location::count()],
                ['Rooms', Room::count()],
                ['Bookings', Booking::count()],
                ['Payments', Payment::count()],
                ['Reservations', Reservation::count()],
            ]
        );
        $this->command->newLine();
        $this->command->info('🔑 Login credentials:');
        $this->command->info('   Email: admin@greatworks.com');
        $this->command->info('   Password: password');
    }
}
