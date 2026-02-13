# Database Seeding Guide

## Overview

This seeding system generates comprehensive fake data for the GreatWorks booking system.

## What Gets Created

When you run the seeder, it generates:

- **1 Admin User**
  - Email: `admin@greatworks.com`
  - Password: `password`

- **20 Regular Users** with realistic fake data

- **5 Locations** (branches across Indonesian cities)
  - Jakarta, Surabaya, Bandung, Medan, Semarang

- **75 Rooms** (15 per location) of different types:
  - 3 Co-Working Spaces
  - 5 Meeting Rooms
  - 4 Private Offices
  - 2 Virtual Offices
  - 1 Event Space

- **100 Bookings** with various statuses:
  - 30 Completed bookings (past dates)
  - 40 Confirmed bookings (upcoming)
  - 15 Pending bookings
  - 15 Cancelled bookings

- **70 Payments** (for confirmed and completed bookings)

- **20 Active Reservations** (recurring bookings)

## How to Use

### 1. Fresh Database with Seed Data

Reset the database and populate it with fake data:

```bash
cd backend
php artisan migrate:fresh --seed
```

### 2. Add More Seed Data (without resetting)

Add seed data to existing database:

```bash
php artisan db:seed
```

### 3. Seed Specific Data

Run only the database seeder:

```bash
php artisan db:seed --class=DatabaseSeeder
```

## Using Factories in Code

You can also use factories in your tests or tinker:

```php
// Create a single user
$user = User::factory()->create();

// Create 10 users
$users = User::factory(10)->create();

// Create a location with rooms
$location = Location::factory()->create();
$rooms = Room::factory(5)->forLocation($location)->create();

// Create a booking for a specific user and room
$booking = Booking::factory()
    ->forUser($user)
    ->forRoom($rooms->first())
    ->confirmed()
    ->create();

// Create a booking on a specific date
$booking = Booking::factory()
    ->onDate('2024-03-15')
    ->confirmed()
    ->create();

// Create different room types
$meetingRoom = Room::factory()->ofType('Meeting Rooms')->create();
$coworkingSpace = Room::factory()->ofType('Co-Working Space')->create();
```

## Available Factory States

### BookingFactory
- `confirmed()` - Confirmed status
- `pending()` - Pending status
- `cancelled()` - Cancelled status
- `completed()` - Completed status
- `forUser(User $user)` - For specific user
- `forRoom(Room $room)` - For specific room
- `onDate(string $date)` - On specific date

### RoomFactory
- `forLocation(Location $location)` - For specific location
- `ofType(string $type)` - Specific room type

### PaymentFactory
- `forBooking(Booking $booking)` - For specific booking
- `completed()` - Completed payment

### ReservationFactory
- `active()` - Active reservation

## Tips

1. **Development**: Use `migrate:fresh --seed` to start with clean data
2. **Testing**: Create specific test scenarios using factories
3. **Demo**: The seeded data provides realistic scenarios for demos
4. **Customization**: Modify `DatabaseSeeder.php` to adjust quantities or data

## Troubleshooting

If seeding fails:

```bash
# Clear config cache
php artisan config:clear

# Optimize autoloader
composer dump-autoload

# Try again
php artisan migrate:fresh --seed
```
