# 🌱 Database Seeding - Quick Start Guide

## ✅ Successfully Created!

Your database seeding system is ready to generate realistic fake data.

## 📦 What Gets Created

When you run the seeder:

| Resource | Count | Description |
|----------|-------|-------------|
| **Users** | 21 | 1 admin + 20 regular users |
| **Locations** | 5 | Branches across Indonesia |
| **Rooms** | 75 | 15 per location (various types) |
| **Bookings** | 100 | Mixed statuses & dates |
| **Payments** | 70 | For confirmed/completed bookings |
| **Reservations** | 20 | Various dates & times |

### Room Types per Location
- 3 Co-Working Spaces
- 5 Meeting Rooms
- 4 Private Offices
- 2 Virtual Offices
- 1 Event Space

### Booking Statuses
- 30 Completed (past dates)
- 40 Confirmed (upcoming)
- 15 Pending
- 15 Cancelled

---

## 🚀 How to Use

### Option 1: Using MySQL (Recommended for Production)

Make sure MySQL is running, then:

```bash
cd backend
php artisan migrate:fresh --seed
```

### Option 2: Using SQLite (Good for Testing)

```bash
cd backend
DB_CONNECTION=sqlite DB_DATABASE=database/database.sqlite php artisan migrate:fresh --seed
```

### Add More Data (Without Reset)

```bash
php artisan db:seed
```

---

## 🔑 Default Login Credentials

After seeding, you can login with:

```
Email: admin@greatworks.com
Password: password
```

All other users have the default password: `password`

---

## 💻 Using Factories in Code

### Create Single Items

```php
// Create a user
$user = User::factory()->create();

// Create a location
$location = Location::factory()->create();

// Create a room in a specific location
$room = Room::factory()
    ->forLocation($location)
    ->ofType('Meeting Rooms')
    ->create();
```

### Create Bookings

```php
// Create a confirmed booking
$booking = Booking::factory()->confirmed()->create();

// Create a booking for a specific user and room
$booking = Booking::factory()
    ->forUser($user)
    ->forRoom($room)
    ->onDate('2026-03-15')
    ->confirmed()
    ->create();

// Create multiple bookings
$bookings = Booking::factory(10)->confirmed()->create();
```

### Create Related Data

```php
// Create a location with rooms and bookings
$location = Location::factory()->create();

$rooms = Room::factory(5)
    ->forLocation($location)
    ->create();

foreach ($rooms as $room) {
    Booking::factory(3)
        ->forRoom($room)
        ->confirmed()
        ->create();
}
```

---

## 🎯 Available Factory Methods

### **BookingFactory**
- `confirmed()` - Confirmed bookings
- `pending()` - Pending approval
- `cancelled()` - Cancelled bookings
- `completed()` - Past completed bookings
- `forUser(User $user)` - Assign to specific user
- `forRoom(Room $room)` - Assign to specific room
- `onDate(string $date)` - Set specific date

### **RoomFactory**
- `forLocation(Location $location)` - Assign to location
- `ofType(string $type)` - Set room type
  - 'Co-Working Space'
  - 'Meeting Rooms'
  - 'Private Offices'
  - 'Virtual Offices'
  - 'Event Spaces'

### **PaymentFactory**
- `forBooking(Booking $booking)` - Link to booking
- `completed()` - Mark as paid

### **ReservationFactory**
- `confirmed()` - Confirmed reservation

---

## 🛠️ Customization

### Change Quantities

Edit `backend/database/seeders/DatabaseSeeder.php`:

```php
// Change from 20 to 50 users
$users = User::factory(50)->create();

// Change from 5 to 10 locations
$locations = Location::factory(10)->create();

// Adjust rooms per location
$coworkingRooms = Room::factory(5)  // was 3
    ->forLocation($location)
    ->ofType('Co-Working Space')
    ->create();
```

### Add Custom Data

```php
// Add a specific location
Location::factory()->create([
    'name' => 'GreatWorks HQ',
    'city' => 'Manila',
    'country' => 'Philippines',
]);

// Add a VIP user
User::factory()->create([
    'name' => 'John Doe',
    'email' => 'john@company.com',
    'role' => 'admin',
]);
```

---

## 🔧 Troubleshooting

### Database Connection Error

Make sure your `.env` file is configured:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=greatwork_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
composer dump-autoload
```

### Start Fresh

```bash
# Drop all tables and recreate with fresh data
php artisan migrate:fresh --seed
```

---

## 📊 Verify Data

Check what was created:

```bash
php artisan tinker
```

Then run:

```php
User::count();
Location::count();
Room::count();
Booking::count();

// See first user
User::first();

// See all locations
Location::all();

// Today's bookings
Booking::whereDate('date', today())->count();
```

---

## 🎉 Success!

Your database is now populated with realistic fake data for development and testing!
