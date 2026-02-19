<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Locations
        DB::table('locations')->insert([
            ['name' => 'GreatWork Mega Tower', 'address' => '123 Ayala Ave', 'city' => 'Makati', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'GreatWork Business Campus', 'address' => '456 BGC Blvd', 'city' => 'Taguig', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'GreatWork Studio', 'address' => '789 Ortigas Ave', 'city' => 'Pasig', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Users
        DB::table('users')->insert([
            ['name' => 'Admin User', 'email' => 'admin@greatwork.com', 'password' => Hash::make('password'), 'role' => 'admin', 'status' => 'active', 'location_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mega Tower Mod', 'email' => 'mod.megatower@greatwork.com', 'password' => Hash::make('password'), 'role' => 'moderator', 'status' => 'active', 'location_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Business Campus Mod', 'email' => 'mod.campus@greatwork.com', 'password' => Hash::make('password'), 'role' => 'moderator', 'status' => 'active', 'location_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Studio Mod', 'email' => 'mod.studio@greatwork.com', 'password' => Hash::make('password'), 'role' => 'moderator', 'status' => 'active', 'location_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Juan dela Cruz', 'email' => 'juan@email.com', 'password' => Hash::make('password'), 'role' => 'customer', 'status' => 'active', 'location_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Maria Santos', 'email' => 'maria@email.com', 'password' => Hash::make('password'), 'role' => 'customer', 'status' => 'active', 'location_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Rooms
        DB::table('rooms')->insert([
            ['location_id' => 1, 'name' => 'Open Desk Area A', 'type' => 'co_working', 'capacity' => 20, 'price_per_hour' => 150.00, 'floor' => '3F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 1, 'name' => 'Virtual Suite 1', 'type' => 'virtual_offices', 'capacity' => 1, 'price_per_hour' => 200.00, 'floor' => '4F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 1, 'name' => 'Executive Office 1', 'type' => 'private_offices', 'capacity' => 5, 'price_per_hour' => 500.00, 'floor' => '5F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 1, 'name' => 'The Grand Hall', 'type' => 'events_meeting_room', 'capacity' => 50, 'price_per_hour' => 1500.00, 'floor' => '6F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 2, 'name' => 'Open Desk Area B', 'type' => 'co_working', 'capacity' => 30, 'price_per_hour' => 150.00, 'floor' => '2F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 2, 'name' => 'Virtual Suite 2', 'type' => 'virtual_offices', 'capacity' => 1, 'price_per_hour' => 200.00, 'floor' => '2F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 2, 'name' => 'Executive Office 2', 'type' => 'private_offices', 'capacity' => 8, 'price_per_hour' => 600.00, 'floor' => '3F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 2, 'name' => 'Conference Room A', 'type' => 'events_meeting_room', 'capacity' => 20, 'price_per_hour' => 1000.00, 'floor' => '4F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 3, 'name' => 'Creative Space', 'type' => 'co_working', 'capacity' => 15, 'price_per_hour' => 150.00, 'floor' => '1F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 3, 'name' => 'Private Pod', 'type' => 'private_offices', 'capacity' => 3, 'price_per_hour' => 400.00, 'floor' => '2F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['location_id' => 3, 'name' => 'Workshop Room', 'type' => 'events_meeting_room', 'capacity' => 25, 'price_per_hour' => 800.00, 'floor' => '2F', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
