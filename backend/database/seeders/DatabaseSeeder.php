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
        $this->command->info('👥 Creating 20 regular users...');
        $users = User::factory(20)->create();
        $this->command->info('✅ Users created');

        // Create Locations
        $this->command->info('🏢 Creating 5 locations...');
        $locations = Location::factory(5)->create();
        $this->command->info('✅ Locations created');

        // Create Rooms for each location
        $this->command->info('🚪 Creating rooms for each location...');
        $allRooms = collect();

        foreach ($locations as $location) {
            $this->command->info("  📍 {$location->name}");

            // Create different types of rooms per location
            $coworkingRooms = Room::factory(3)
                ->forLocation($location)
                ->ofType('Co-Working Space')
                ->create();

            $meetingRooms = Room::factory(5)
                ->forLocation($location)
                ->ofType('Meeting Rooms')
                ->create();

            $privateOffices = Room::factory(4)
                ->forLocation($location)
                ->ofType('Private Offices')
                ->create();

            $virtualOffices = Room::factory(2)
                ->forLocation($location)
                ->ofType('Virtual Offices')
                ->create();

            $eventSpaces = Room::factory(1)
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
        $this->command->info('📅 Creating 100 bookings with various statuses...');

        // Past bookings (completed)
        $pastBookings = Booking::factory(30)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->completed()
            ->create([
                'date' => fake()->dateTimeBetween('-30 days', '-1 day'),
            ]);

        // Current/upcoming bookings (confirmed)
        $confirmedBookings = Booking::factory(40)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->confirmed()
            ->create([
                'date' => fake()->dateTimeBetween('now', '+30 days'),
            ]);

        // Pending bookings
        $pendingBookings = Booking::factory(15)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->pending()
            ->create([
                'date' => fake()->dateTimeBetween('now', '+30 days'),
            ]);

        // Cancelled bookings
        $cancelledBookings = Booking::factory(15)
            ->recycle($users->push($admin))
            ->recycle($allRooms)
            ->cancelled()
            ->create([
                'date' => fake()->dateTimeBetween('-15 days', '+15 days'),
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
        $this->command->info('🔄 Creating 20 reservations...');
        Reservation::factory(20)
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
