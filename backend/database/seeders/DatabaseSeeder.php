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

        // Create Admin User (only if doesn't exist)
        $this->command->info('👤 Checking admin user...');
        $admin = User::where('email', 'admin@greatworks.com')->first();

        if (!$admin) {
            $admin = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@greatworks.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);
            $this->command->info("✅ Admin created: {$admin->email} / password");
        } else {
            $this->command->info("ℹ️  Admin already exists: {$admin->email}");
        }

        // Create Regular Users (only if less than target)
        $currentUserCount = User::where('role', '!=', 'admin')->count();
        $targetUsers = 100;

        if ($currentUserCount < $targetUsers) {
            $usersToCreate = $targetUsers - $currentUserCount;
            $this->command->info("👥 Creating {$usersToCreate} regular users...");
            $newUsers = User::factory($usersToCreate)->create();
            $this->command->info('✅ Users created');
        } else {
            $this->command->info("ℹ️  Already have {$currentUserCount} users (target: {$targetUsers})");
        }

        $users = User::where('role', '!=', 'admin')->get();

        // Create Locations (only if less than target)
        $currentLocationCount = Location::count();
        $targetLocations = 12;

        if ($currentLocationCount < $targetLocations) {
            $locationsToCreate = $targetLocations - $currentLocationCount;
            $this->command->info("🏢 Creating {$locationsToCreate} locations...");
            Location::factory($locationsToCreate)->create();
            $this->command->info('✅ Locations created');
        } else {
            $this->command->info("ℹ️  Already have {$currentLocationCount} locations (target: {$targetLocations})");
        }

        $locations = Location::all();

        // Create Rooms for each location (only if they don't have rooms yet)
        $this->command->info('🚪 Checking rooms for each location...');
        $allRooms = collect();

        foreach ($locations as $location) {
            $existingRoomCount = $location->rooms()->count();

            if ($existingRoomCount > 0) {
                $this->command->info("  📍 {$location->name} - Already has {$existingRoomCount} rooms");
                $allRooms = $allRooms->merge($location->rooms);
                continue;
            }

            $this->command->info("  📍 {$location->name} - Creating rooms...");

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
        $this->command->info("✅ Total rooms available: {$allRooms->count()}");

        // Create Bookings (only if less than target)
        $currentBookingCount = Booking::count();
        $targetBookings = 1000;

        if ($currentBookingCount < $targetBookings) {
            $this->command->info("📅 Creating bookings (current: {$currentBookingCount}, target: {$targetBookings})...");

            $allUsers = $users->push($admin);

            // Calculate how many of each type to create proportionally
            $remaining = $targetBookings - $currentBookingCount;
            $pastCount = (int) ($remaining * 0.3);      // 30%
            $confirmedCount = (int) ($remaining * 0.4); // 40%
            $pendingCount = (int) ($remaining * 0.15);  // 15%
            $cancelledCount = $remaining - $pastCount - $confirmedCount - $pendingCount; // rest

            // Past bookings (completed)
            $pastBookings = Booking::factory($pastCount)
                ->recycle($allUsers)
                ->recycle($allRooms)
                ->completed()
                ->create([
                    'date' => fake()->dateTimeBetween('-60 days', '-1 day'),
                ]);

            // Current/upcoming bookings (confirmed)
            $confirmedBookings = Booking::factory($confirmedCount)
                ->recycle($allUsers)
                ->recycle($allRooms)
                ->confirmed()
                ->create([
                    'date' => fake()->dateTimeBetween('now', '+60 days'),
                ]);

            // Pending bookings
            $pendingBookings = Booking::factory($pendingCount)
                ->recycle($allUsers)
                ->recycle($allRooms)
                ->pending()
                ->create([
                    'date' => fake()->dateTimeBetween('now', '+60 days'),
                ]);

            // Cancelled bookings
            $cancelledBookings = Booking::factory($cancelledCount)
                ->recycle($allUsers)
                ->recycle($allRooms)
                ->cancelled()
                ->create([
                    'date' => fake()->dateTimeBetween('-30 days', '+30 days'),
                ]);

            $this->command->info('✅ Bookings created');
        } else {
            $this->command->info("ℹ️  Already have {$currentBookingCount} bookings (target: {$targetBookings})");
        }

        $allBookings = Booking::all();

        // Create Payments for confirmed and completed bookings (only if missing)
        $this->command->info('💳 Checking payments...');
        $bookingsNeedingPayments = $allBookings->filter(function($booking) {
            return in_array($booking->status, ['confirmed', 'completed'])
                && !$booking->payments()->exists();
        });

        if ($bookingsNeedingPayments->count() > 0) {
            foreach ($bookingsNeedingPayments as $booking) {
                Payment::factory()
                    ->forBooking($booking)
                    ->completed()
                    ->create([
                        'amount' => $booking->room->price_per_hour * $booking->duration_hours,
                    ]);
            }
            $this->command->info("✅ Payments created: {$bookingsNeedingPayments->count()}");
        } else {
            $this->command->info("ℹ️  All eligible bookings already have payments");
        }

        // Create some Reservations (only if less than target)
        $currentReservationCount = Reservation::count();
        $targetReservations = 100;

        if ($currentReservationCount < $targetReservations) {
            $reservationsToCreate = $targetReservations - $currentReservationCount;
            $this->command->info("🔄 Creating {$reservationsToCreate} reservations...");
            Reservation::factory($reservationsToCreate)
                ->recycle($users)
                ->recycle($allRooms)
                ->confirmed()
                ->create();
            $this->command->info('✅ Reservations created');
        } else {
            $this->command->info("ℹ️  Already have {$currentReservationCount} reservations (target: {$targetReservations})");
        }

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
